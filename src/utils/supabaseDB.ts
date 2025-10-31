import { supabase } from "@/lib/supabase";

export const supabaseDb = {
  // Save or update team
  async saveTeam(teamData: any) {
    // First check if team exists
    const { data: existingTeam, error: checkError } = await supabase
      .from("teams")
      .select("team_id")
      .eq("team_id", teamData.teamId)
      .maybeSingle();

    if (checkError) {
      throw new Error(`Failed to check team: ${checkError.message}`);
    }

    let result;
    if (existingTeam) {
      // Update existing team
      const { data, error } = await supabase
        .from("teams")
        .update({
          team_name: teamData.teamName,
          unlocked_rooms: teamData.unlockedRooms,
          last_updated: new Date().toISOString(),
        })
        .eq("team_id", teamData.teamId)
        .select();

      if (error) {
        throw new Error(`Failed to update team: ${error.message}`);
      }
      result = data;
    } else {
      // Insert new team
      const { data, error } = await supabase
        .from("teams")
        .insert({
          team_id: teamData.teamId,
          team_name: teamData.teamName,
          unlocked_rooms: teamData.unlockedRooms,
          created_at: new Date().toISOString(),
          last_updated: new Date().toISOString(),
        })
        .select();

      if (error) {
        throw new Error(`Failed to insert team: ${error.message}`);
      }
      result = data;
    }

    return result;
  },

  // ... rest of the functions remain the same
  // Get all teams
  async getTeams() {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .order("last_updated", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch teams: ${error.message}`);
    }

    return data.map((team) => ({
      teamId: team.team_id,
      teamName: team.team_name,
      unlockedRooms: team.unlocked_rooms || [],
      createdAt: team.created_at,
      lastUpdated: team.last_updated,
    }));
  },

  // Get single team
  async getTeam(teamId: string) {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("team_id", teamId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch team: ${error.message}`);
    }

    return {
      teamId: data.team_id,
      teamName: data.team_name,
      unlockedRooms: data.unlocked_rooms || [],
      createdAt: data.created_at,
      lastUpdated: data.last_updated,
    };
  },

  // Subscribe to real-time updates
  subscribeToTeams(callback: (teams: any[]) => void) {
    return supabase
      .channel("teams-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teams",
        },
        () => {
          this.getTeams().then(callback).catch(console.error);
        }
      )
      .subscribe();
  },
};
