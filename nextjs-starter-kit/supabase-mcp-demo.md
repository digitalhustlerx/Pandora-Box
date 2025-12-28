3# Supabase MCP Server Setup - Demonstration

## Configuration Complete ✓

The Supabase MCP server has been successfully configured in `blackbox_mcp_settings.json` with the following settings:

```json
{
  "mcpServers": {
    "github.com/supabase-community/supabase-mcp": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp"
    }
  }
}
```

## Available Tools

The Supabase MCP server provides the following tool groups:

### 1. **Knowledge Base Tools** (Enabled by default)
- `search_docs`: Search Supabase documentation for up-to-date information

### 2. **Account Tools** (When not project-scoped)
- `list_projects`: List all Supabase projects
- `get_project`: Get project details
- `create_project`: Create a new project
- `pause_project`: Pause a project
- `restore_project`: Restore a project
- `list_organizations`: List organizations
- `get_organization`: Get organization details
- `get_cost`: Get cost estimates
- `confirm_cost`: Confirm cost understanding

### 3. **Database Tools** (Enabled by default)
- `list_tables`: List all tables in specified schemas
- `list_extensions`: List database extensions
- `list_migrations`: List database migrations
- `apply_migration`: Apply SQL migrations
- `execute_sql`: Execute raw SQL queries

### 4. **Debugging Tools** (Enabled by default)
- `get_logs`: Get logs by service type (api, postgres, functions, auth, storage, realtime)
- `get_advisors`: Get advisory notices for security/performance

### 5. **Development Tools** (Enabled by default)
- `get_project_url`: Get API URL for a project
- `get_publishable_keys`: Get anonymous API keys
- `generate_typescript_types`: Generate TypeScript types from database schema

### 6. **Edge Functions Tools** (Enabled by default)
- `list_edge_functions`: List all Edge Functions
- `get_edge_function`: Get Edge Function file contents
- `deploy_edge_function`: Deploy Edge Functions

### 7. **Branching Tools** (Experimental, requires paid plan)
- `create_branch`: Create development branch
- `list_branches`: List development branches
- `delete_branch`: Delete a branch
- `merge_branch`: Merge branch to production
- `reset_branch`: Reset branch migrations
- `rebase_branch`: Rebase branch on production

### 8. **Storage Tools** (Disabled by default)
- `list_storage_buckets`: List storage buckets
- `get_storage_config`: Get storage configuration
- `update_storage_config`: Update storage configuration

## Example Usage Scenarios

### Scenario 1: Search Documentation
**Tool**: `search_docs`
**Use Case**: Find information about Supabase authentication
**Example Query**: "How do I implement email authentication in Supabase?"

### Scenario 2: Database Management
**Tool**: `list_tables`
**Use Case**: View all tables in your database
**Example**: List tables in the public schema

### Scenario 3: Generate TypeScript Types
**Tool**: `generate_typescript_types`
**Use Case**: Generate type-safe TypeScript definitions from your database schema
**Example**: Create types for your Next.js application

### Scenario 4: Deploy Edge Function
**Tool**: `deploy_edge_function`
**Use Case**: Deploy a serverless function to handle API requests
**Example**: Deploy a function to process webhooks

### Scenario 5: Execute SQL Query
**Tool**: `execute_sql`
**Use Case**: Run database queries directly
**Example**: `SELECT * FROM users WHERE created_at > NOW() - INTERVAL '7 days'`

## Security Best Practices

✓ **Read-Only Mode**: Add `?read_only=true` to the URL for safer operations
✓ **Project Scoping**: Add `?project_ref=<your-project-id>` to limit access to one project
✓ **Feature Groups**: Add `?features=database,docs` to enable only specific tool groups

### Recommended Configuration for Production Safety:

```json
{
  "mcpServers": {
    "github.com/supabase-community/supabase-mcp": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?read_only=true&project_ref=YOUR_PROJECT_ID&features=database,docs"
    }
  }
}
```

## Next Steps

1. **Authentication**: When you first use the MCP server, you'll be prompted to log in to Supabase
2. **Select Organization**: Choose the organization containing your project
3. **Use Tools**: Start using the available tools through your AI assistant
4. **Review Actions**: Always review tool calls before executing them

## Testing the Server

To test if the server is working correctly, you can:

1. Ask your AI assistant to search the Supabase documentation
2. Request to list your Supabase projects
3. Generate TypeScript types from your database schema
4. Query your database (in read-only mode for safety)

## Resources

- [Supabase MCP Documentation](https://supabase.com/docs/guides/getting-started/mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/introduction)
- [GitHub Repository](https://github.com/supabase-community/supabase-mcp)
