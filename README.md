Nobzo Technical evaluation: Mobile developer.
Task: Scroll feed
Stack Used:
- Expo
- Typescript
- React Native

API used:
https://picsum.photos/v2/list?page=<page>&limit=<limit>

Each Item Displays
● Image (use download_url)
● Author name
● Item id


Features Implemented:
Infinite scrolling with pagination
Pull-to-refresh
Loading states (initial + loading more)
Error state with retry
Empty state
Responsive UI for different screen sizes/orientations

1) UI
● Single screen with a header (e.g., “Feed”)
● Scrollable list (FlatList recommended)
● Each item is a card-style row with image + metadata

2) Infinite Scroll
● Load page 1 on app start
● When user nears the bottom, fetch the next page and append
● Prevent duplicate calls (no “fetch loop”)

3) Pull to Refresh
● Pull-to-refresh reloads from page 1 and resets the list

4) States & UX
● Show loading indicator on initial load
● Show “loading more” indicator when fetching next page
● Show an error state with a Retry action if request fails
● Show an empty state if no items returned

5) Responsiveness
● Must look good on small and large screens (portrait + landscape)

Installation
(From GitHub)
Clone the repository:
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

Install dependencies:
npm install
Run with Expo

Start the development server:
npx expo start

Then:
Install Expo Go on your phone
Scan the QR code from the terminal or browser


Assumptions:
The Pagination stops when returned items are less than the requested limit.
Images are loaded directly from the provided public API.
FlatList used for performance and scalability.