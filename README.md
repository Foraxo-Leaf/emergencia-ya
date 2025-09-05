# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Video Cache

Tutorial videos retrieved from Firebase Storage are cached using a **Cache First** strategy.
The cache can store up to **20 videos** and each entry expires after **30 days**.
This allows previously viewed videos to remain available offline while keeping storage usage under control.
