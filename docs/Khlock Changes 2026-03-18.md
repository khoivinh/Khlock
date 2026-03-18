# Khlock Changes 2026-03-18 
#khlock
- Change position of “Show Live Time” button and change its button label to say “Reset Time”
  - The button will now be a blue text link
  - Refer to this Figma component for design specifications: https://www.figma.com/design/ykzuXYZ4gnogbNKZeV3Q1H/Khlock-Design?node-id=70-1954&t=Qp7vA7G6Cg7K8e43-11
- Changes to display of the Add Cities menu
  - The menu should now span the width of the body column
  - On mobile, display the menu near the top of the viewport, so that the user is able to view as much of it as possible
  - Refer to this Figma section for design mock-ups of this change on desktop and on mobile: https://www.figma.com/design/ykzuXYZ4gnogbNKZeV3Q1H/Khlock-Design?node-id=36-3207&t=Qp7vA7G6Cg7K8e43-11
  - Also, when adding a city, recognize when a city is already represented by a clock tile and print an appropriate status message like “Already displayed,” instead of “No cities found”
- Changes to the Clock Tiles
  - Remove the ability to toggle between list view and grid view; this is no longer necessary
  - Remove the calendar icon in Clock Tiles, and remove the connected “Meeting Time Zone Calculations” feature; this is not needed
  - For cities where the displayed time is either the previous or the next day, add a new inline badge to say either “Next Day” or “Prev Day”
    - Refer to this Figma component for design specifications for the badge: https://www.figma.com/design/ykzuXYZ4gnogbNKZeV3Q1H/Khlock-Design?node-id=27-973&t=Qp7vA7G6Cg7K8e43-11
  - Revise the interactions for dragging and dropping Clock Tiles
    - The blue drop indicator line should always appear to the LEFT of the destination spot
    - While being dragged, the clock tile should be 90% opacity; it also gets a new, subtle drop shadow
    - Refer to this Figma frame for an illustration of a drag-and-drop in action: https://www.figma.com/design/ykzuXYZ4gnogbNKZeV3Q1H/Khlock-Design?node-id=4-2&t=Qp7vA7G6Cg7K8e43-11
    - Refer to this Figma component for exact specifications for the various states: https://www.figma.com/design/ykzuXYZ4gnogbNKZeV3Q1H/Khlock-Design?node-id=17-2410&t=Qp7vA7G6Cg7K8e43-11
  - Replace the delete “X” button in each Clock Tile with a new ellipsis icon (enclosed in a circle
    - Clicking or tapping on this should reveal a dialog that asks the user to confirm whether they want to remove the Clock Tile or Cancel
- Make a plan to implement Clerk for account creation
  - A new “Login or Sign Up” button appears at top right
  - When the user is logged in, the button turns into a hamburger icon
  - Do not implement this yet; help me understand what design decisions need to be made to add this later
    
