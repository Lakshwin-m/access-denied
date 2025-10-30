const API_BASE = "/api";

export const api = {
  // Save or update team
  async saveTeam(teamData: any) {
    const response = await fetch(`${API_BASE}/teams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamData),
    });

    if (!response.ok) {
      throw new Error("Failed to save team");
    }

    return response.json();
  },

  // Get all teams
  async getTeams() {
    const response = await fetch(`${API_BASE}/teams`);

    if (!response.ok) {
      throw new Error("Failed to fetch teams");
    }

    return response.json();
  },
};
