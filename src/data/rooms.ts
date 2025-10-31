export interface Room {
  id: number;
  password: string;
  link: string;
  title: string;
}

export const rooms: Room[] = [
  {
    id: 1,
    password: "neonX21",
    link: "https://leetcode.com/problems/two-sum/", // Easy
    title: "Room of Coffee and Chaos",
  },
  {
    id: 2,
    password: "cipher42",
    link: "https://leetcode.com/problems/valid-parentheses/", // Easy
    title: "Banana Republic of Bugs",
  },
  {
    id: 3,
    password: "vector99",
    link: "https://leetcode.com/problems/merge-two-sorted-lists/", // Easy
    title: "The Infinite Loop Lounge",
  },
  {
    id: 4,
    password: "matrix08",
    link: "https://leetcode.com/problems/move-zeroes/", // Easy
    title: "404 Not Found Room",
  },
  {
    id: 5,
    password: "glitch07",
    link: "https://leetcode.com/problems/longest-palindrome/", // Medium
    title: "The Segmentation Fault Hall",
  },
  {
    id: 6,
    password: "decode13",
    link: "https://leetcode.com/problems/rotate-image/", // Medium
    title: "Runtime Panic Pavilion",
  },
  {
    id: 7,
    password: "binary27",
    link: "https://leetcode.com/problems/top-k-frequent-elements/", // Medium
    title: "The Infinite Recursion Chamber",
  },
  {
    id: 8,
    password: "kernel19",
    link: "https://leetcode.com/problems/course-schedule/", // Medium
    title: "The Null Pointer Nexus",
  },
  {
    id: 9,
    password: "proxy33",
    link: "https://leetcode.com/problems/group-anagrams/", // Medium
    title: "SegFault Spa",
  },
  {
    id: 10,
    password: "quantum56",
    link: "https://leetcode.com/problems/word-ladder/", // Hard
    title: "The Final Boss Terminal",
  },
];
