import { VercelRequest, VercelResponse } from "@vercel/node";

// Simple in-memory storage (will reset on server cold start)
// For production, consider using a proper database
let teams: any[] = [];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS for all origins
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    try {
      const teamData = req.body;

      // Check if team already exists
      const existingIndex = teams.findIndex(
        (t) => t.teamId === teamData.teamId
      );

      if (existingIndex >= 0) {
        // Update existing team
        teams[existingIndex] = teamData;
      } else {
        // Add new team
        teams.push(teamData);
      }

      console.log("Team saved:", teamData.teamName);
      res.status(200).json({ success: true, teamId: teamData.teamId });
    } catch (error) {
      console.error("Error saving team:", error);
      res.status(500).json({ success: false, error: "Failed to save team" });
    }
  } else if (req.method === "GET") {
    // Return all teams sorted by progress
    const sortedTeams = teams.sort(
      (a, b) => b.unlockedRooms.length - a.unlockedRooms.length
    );
    res.status(200).json(sortedTeams);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
