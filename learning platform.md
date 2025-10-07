

### for Course Discovery Platform

**Project Context:**
Create a public-facing course discovery platform using Laravel 12 (backend) and React (frontend), leveraging Inertia.js for navigation and shadcn UI components styled with Tailwind CSS. The backend will serve as a course catalog with search/filter, not content hosting. Instead of direct enrollment, users are redirected to third-party platforms via provided external links.

***

### General Setup

- Do not repeat installation or configuration of the Laravel 12 + React + Inertia + Tailwind stack, as all are already set up.
- Ensure the latest versions of shadcn UI components are available for frontend development.
- Confirm any backend or frontend packages needed for searching, filtering, image handling, or dropdowns are installed; list package names and their intended use.

***

### Backend Instructions

**Goal:** Build a robust backend exposing course data, with relationships, search/filter, and clean code structure.

**Database Migrations:**

- Design migrations for at least these tables:
    - `courses`: title, description, external_url, duration, platform, image_url, category_id, have_cert,level,  created_at, updated_at
    - `categories`: name, slug, created_at, updated_at
    - `tags` table and a pivot table for course-tag relations for better filtering.
- Add indexes on searchable/filterable fields (title, category, platform, etc).
- Use appropriate data types and constraints (e.g., URL validation, non-nullable titles).
- Define relationships (foreign keys) between courses and categories (and tags).

**Models:**

- Create Eloquent models for `Course`, `Category`, (and `Tag`) reflecting these relationships and attributes.

**Repositories:**

- Implement repository classes for handling all database queries (fetch, filter, search) abstracted from controllers.
- Document the interface for fetching a paginated, filterable, and searchable course list.

**Services:**

- Create service classes for any business logic (e.g., search query parsing, URL validation, image handling if images are uploaded and stored locally).

**Controllers:**

- Expose routes prefixed under `/courses` (list, show).
- List endpoint must accept query parameters for search (by keyword), filter (by category, platform, tags), and pagination.
- Use resources/resource collections to structure course responses (include category info, image URL, external URL, and duration).
- If authentication or admin features are needed in the future, design code to be extendable, but this version is public read-only.

**Other Backend Concerns:**

- List any backend packages required (such as `spatie/laravel-query-builder` for advanced filtering/search, `intervention/image` if image manipulation is needed).
- Ensure CORS and Inertia configuration supports frontend-backend requests seamlessly.

***

### Frontend Instructions

**Goal:**
Create a clean, user-friendly interface for course browsing, searching, and filtering, with links to each external platform. Use only Inertia for route navigation—DO NOT use axios or any non-Inertia HTTP utilities.

**Types:**

- Define TypeScript types/interfaces for `Course`, `Category`, (and `Tag`), and paginated responses.

**Hooks:**

- Write custom React hooks for:
    - Fetching the course list (with search/filter/pagination) from Inertia endpoints.
    - Managing query state (search term, filters, selected category, pagination).
    - Handling loading states and errors gracefully.

**Components:**

- **Navbar:**
    - Contains logo (left), search input (middle), and navigation links (right).
    - Navigation links for categories (dropdown menu powered by shadcn UI components).
- **Landing Page Layout:**
    - Below navbar, render a grid of course cards.
    - Each card shows course image, title, short description, duration, external platform name/logo, and a "View Course" button (with an external link to course).
    - Use shadcn UI card, dropdown, button, and input components styled with Tailwind for all UI elements.
    - When click on course it will navigate to the selected course page and shows all details using shadcn styles.
- **Search \& Filter:**
    - Search input (navbar) triggers real-time or debounced search request to the backend.
    - Category and platform filter dropdowns update the course grid accordingly, using Inertia navigation (not client-side filtering).
- **Pagination:**
    - Implement pagination controls (previous/next, or page numbers) using Inertia.

**Details \& Best Practices:**

- Ensure accessibility and responsiveness (mobile/tablet/desktop layouts).
- Keep components modular and clean—one-purpose per file.
- Document the function and data contract for each custom hook and prop interface.
- If any additional UI packages are required for dropdowns, grid layouts, or icons, list them before implementing.
- Use only Inertia navigation and data fetching, not any HTTP or REST client library.

***

### Package Checklist 

**Backend:**

- For advanced filtering/search: `spatie/laravel-query-builder`
- For image upload/processing: `intervention/image` (if images stored locally; if only URLs, skip).
**Frontend:**
- shadcn UI components
- tailwindcss (should be set up already)
- Any required React icons or helper libraries for platform logos, if not already present

***
