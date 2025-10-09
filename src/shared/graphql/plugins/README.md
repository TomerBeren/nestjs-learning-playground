# GraphQL Query Complexity

Query complexity analysis prevents expensive or malicious queries from overwhelming your GraphQL server by assigning a cost to each field and rejecting queries that exceed a maximum threshold.

## Overview

This project uses `graphql-query-complexity` to:
- ✅ Assign complexity scores to queries, mutations, and fields
- ✅ Calculate total query complexity before execution
- ✅ Reject queries exceeding the maximum allowed complexity (50)
- ✅ Log complexity for monitoring and optimization

## How It Works

### 1. Simple Fields (Complexity: 1)
```graphql
query {
  post(id: 1) {    # Base query: 1
    title          # +1
    content        # +1
  }
}
# Total Complexity: 3
```

### 2. Expensive Fields (Higher Complexity)
```graphql
query {
  post(id: 1) {    # Base query: 1
    title          # +1
    author {       # +3 (more expensive - requires join)
      firstName    # +1
      lastName     # +1
    }
  }
}
# Total Complexity: 7
```

### 3. Lists Multiply Complexity
```graphql
query {
  posts {          # Base query: 2
    title          # +1 per post
    content        # +1 per post
    author {       # +3 per post
      firstName    # +1 per post
    }
  }
}
# If 10 posts returned: 2 + (10 × 6) = 62 → REJECTED!
```

### 4. Dynamic Complexity
```graphql
query {
  searchAuthors(limit: 20) {  # Complexity = limit × 2 = 40
    firstName
    lastName
  }
}
# Total Complexity: 40 (calculated dynamically based on limit)
```

## Complexity Configuration

### Maximum Allowed Complexity
**Current Limit:** `50`

**Location:** `src/shared/graphql/plugins/complexity.plugin.ts`

```typescript
const maxComplexity = 50;
```

### Field Complexity

#### Simple Fields (1 point)
```typescript
@Field({ complexity: 1 })
title: string;
```

#### Expensive Fields (3+ points)
```typescript
@Field(type => Author, { complexity: 3 })
author: Author;  // Requires database join
```

#### Resolver Field Complexity
```typescript
@ResolveField("posts", () => [Post], { complexity: 5 })
async posts(@Parent() author: Author) {
  // Expensive operation - N+1 problem potential
}
```

### Query/Mutation Complexity

#### Fixed Complexity
```typescript
@Query(() => [Post], { complexity: 2 })
findAll() { ... }
```

#### Dynamic Complexity
```typescript
@Query(() => [Author], { 
  complexity: (options) => options.args.limit * 2
})
async searchAuthors(@Args() args: GetAuthorArgs) { ... }
```

## Applied Complexity in This Project

### Queries
| Query | Complexity | Reason |
|-------|-----------|---------|
| `posts` | 2 | Returns list of posts |
| `post(id)` | 1 | Single item lookup |
| `searchAuthors(limit)` | `limit × 2` | Dynamic based on requested items |

### Mutations
| Mutation | Complexity | Reason |
|----------|-----------|---------|
| `addComment` | 5 | Database write + PubSub publish |
| `upvotePost` | 3 | Database write operation |

### Fields
| Field | Complexity | Reason |
|-------|-----------|---------|
| `Post.title` | 1 | Simple scalar field |
| `Post.author` | 3 | Requires join/lookup |
| `Author.posts` | 5 | N+1 problem potential (mitigated by DataLoader) |

## Example Scenarios

### ✅ Allowed Query (Complexity: 15)
```graphql
query {
  post(id: 1) {           # 1
    title                 # +1
    content               # +1
    votes                 # +1
    author {              # +3
      firstName           # +1
      lastName            # +1
    }
  }
}
# Total: 9 ✅ Allowed
```

### ✅ Allowed Query (Complexity: 45)
```graphql
query {
  searchAuthors(limit: 10) {  # 10 × 2 = 20
    firstName                  # +1 × 10 = 10
    lastName                   # +1 × 10 = 10
    posts {                    # +5 × 10 = 50... wait, this would be over!
  }
}
# Without posts field: 40 ✅ Allowed
```

### ❌ Rejected Query (Complexity: 110)
```graphql
query {
  searchAuthors(limit: 20) {  # 20 × 2 = 40
    firstName                  # +1 × 20 = 20
    lastName                   # +1 × 20 = 20
    posts {                    # +5 × 20 = 100... way over!
  }
}
# Total: 180 ❌ REJECTED!
# Error: "Query is too complex: 180. Maximum allowed complexity: 50"
```

### ✅ Optimized Query (Complexity: 40)
```graphql
query {
  searchAuthors(limit: 10) {  # 10 × 2 = 20
    firstName                  # +1 × 10 = 10
    lastName                   # +1 × 10 = 10
  }
}
# Total: 40 ✅ Allowed
```

## Monitoring

All queries log their complexity:

```
[Query Complexity] posts: 25/50
[Query Complexity] searchAuthors: 40/50
[Query Complexity] addComment: 5/50
```

## Security Benefits

1. **Prevents DoS Attacks**
   - Malicious queries with deeply nested fields are rejected
   - Protects server resources

2. **Performance Guarantees**
   - Ensures queries stay within acceptable resource limits
   - Prevents accidental expensive queries

3. **Fair Resource Allocation**
   - All clients subject to same complexity limits
   - Prevents one client from monopolizing resources

## Testing

Run complexity plugin tests:
```bash
npm test -- complexity.plugin.spec.ts
```

Tests cover:
- ✅ Queries below limit (allowed)
- ✅ Queries exceeding limit (rejected)
- ✅ Queries at exact limit (allowed)
- ✅ Anonymous queries
- ✅ Zero complexity queries (introspection)

## Best Practices

### 1. Assign Realistic Complexity
```typescript
// ✅ Good - reflects actual cost
@Field({ complexity: 5 })
comments: Comment[];  // Database query + processing

// ❌ Too low - underestimates cost
@Field({ complexity: 1 })
comments: Comment[];  // Should be higher!
```

### 2. Use Dynamic Complexity for Pagination
```typescript
// ✅ Good - scales with limit
@Query({ 
  complexity: (options) => options.args.limit * 2 
})
searchAuthors(@Args('limit') limit: number) { ... }
```

### 3. Higher Complexity for Expensive Operations
```typescript
// Mutations that write to DB
@Mutation({ complexity: 5 })

// Fields that require joins
@Field({ complexity: 3 })

// Simple scalar fields
@Field({ complexity: 1 })
```

### 4. Monitor and Adjust
- Check logs for common query complexities
- Adjust `maxComplexity` based on server capacity
- Fine-tune field complexity based on actual performance

## Adjusting the Limit

**Development:** Higher limit for testing (current: 50)
**Production:** Lower limit for security (recommended: 30-50)

**To change:**
```typescript
// src/shared/graphql/plugins/complexity.plugin.ts
const maxComplexity = 30; // Adjust as needed
```

## Related Features

- **DataLoader:** Optimizes N+1 queries, reducing actual cost
- **Pagination:** Limits result sets, controlled by complexity
- **Field Middleware:** Can transform fields after complexity check passes

## Further Reading

- [graphql-query-complexity](https://github.com/slicknode/graphql-query-complexity)
- [GraphQL Best Practices - Query Complexity](https://www.apollographql.com/docs/apollo-server/performance/apq/)
- [Securing GraphQL APIs](https://www.apollographql.com/blog/graphql/security/securing-your-graphql-api-from-malicious-queries/)
