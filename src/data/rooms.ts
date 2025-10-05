export interface Room {
  id: number;
  password: string;
  link: string;
  title: string;
}

export const rooms: Room[] = [
  { 
    id: 1, 
    password: "cipher01", 
    link: "https://leetcode.com/problems/two-sum/",
    title: "Room 01"
  },
  { 
    id: 2, 
    password: "matrix02", 
    link: "https://leetcode.com/problems/valid-parentheses/",
    title: "Room 02"
  },
  { 
    id: 3, 
    password: "nexus03", 
    link: "https://leetcode.com/problems/merge-two-sorted-lists/",
    title: "Room 03"
  },
  { 
    id: 4, 
    password: "vector04", 
    link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    title: "Room 04"
  },
  { 
    id: 5, 
    password: "proxy05", 
    link: "https://leetcode.com/problems/valid-palindrome/",
    title: "Room 05"
  },
  { 
    id: 6, 
    password: "binary06", 
    link: "https://leetcode.com/problems/invert-binary-tree/",
    title: "Room 06"
  },
  { 
    id: 7, 
    password: "stack07", 
    link: "https://leetcode.com/problems/valid-anagram/",
    title: "Room 07"
  },
  { 
    id: 8, 
    password: "heap08", 
    link: "https://leetcode.com/problems/binary-search/",
    title: "Room 08"
  },
  { 
    id: 9, 
    password: "graph09", 
    link: "https://leetcode.com/problems/flood-fill/",
    title: "Room 09"
  },
  { 
    id: 10, 
    password: "crypto10", 
    link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    title: "Room 10"
  },
  { 
    id: 11, 
    password: "decode11", 
    link: "https://leetcode.com/problems/balanced-binary-tree/",
    title: "Room 11"
  },
  { 
    id: 12, 
    password: "kernel12", 
    link: "https://leetcode.com/problems/linked-list-cycle/",
    title: "Room 12"
  },
  { 
    id: 13, 
    password: "shell13", 
    link: "https://leetcode.com/problems/implement-queue-using-stacks/",
    title: "Room 13"
  },
  { 
    id: 14, 
    password: "final14", 
    link: "https://leetcode.com/problems/merge-intervals/",
    title: "Room 14"
  },
];
