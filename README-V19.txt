PORTFOLIO V19 — DESKTOP VIDEO PREVIEW WITHOUT CROP

Changes:
- Corrected the desktop video preview sizing so the ENTIRE source video
  is visible inside the phone mockup (object-fit: contain).
- Removed forced 9:16 aspect ratio on the desktop video element;
  the 9:16 phone shell itself is unchanged.
- If a video is wider/narrower than the mockup, black space appears
  rather than cutting off the picture.
- Mobile layout, native fullscreen, play-to-load performance,
  and 1080p video files are unchanged.
- Updated stylesheet query version in index.html so browsers download
  the updated styles instead of using a cached older version.

Upload to the same GitHub Pages portfolio folder:
1. Replace index.html and styles.css with these V19 versions.
2. script.js is included for completeness, but is unchanged.
3. KEEP your existing assets folder (including videos and posters).
4. Commit the changes, then refresh the live website.

This package contains only the three code files and this README;
no MP4 or image assets were modified.
