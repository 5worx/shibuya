import { execSync } from "child_process";

export const BacklogController = {
  getBugs: () => {
    try {
      // Wir nutzen 'bug ls', um die Liste zu bekommen
      const output = execSync("git-bug bug").toString().trim();
      if (!output) return [];

      return output.split("\n").map((line) => {
        // 1. ID extrahieren (Erster Block vor dem Leerzeichen, ohne Klammern)
        const id = line.split(/\s+/)[0].replace(/[\[\]]/g, "");

        // 2. Sprint finden (Wir suchen nach dem Muster SprintXX)
        const labels = execSync(`git-bug bug label ${id}`).toString().trim();

        const sprintMatch = labels.match(/Sprint(\d+)/i);
        const sprint = sprintMatch ? parseInt(sprintMatch[1], 10) : 0;

        // 3. Titel finden (Alles zwischen ID und dem ersten Label '[')
        let title = line
          .substring(line.indexOf(id) + id.length)
          .split("[")[0]
          .trim();

        return { id, title, sprint };
      });
    } catch (e) {
      console.error("Backlog Read Error:", e.message);
      return [];
    }
  },

  setSprint: (bugId, sprintNum) => {
    try {
      // 1. Bestehende Sprint-Labels finden und entfernen
      // Das ist wichtig, sonst "klebt" der Bug in mehreren Spalten fest!
      const bugInfo = execSync(`git-bug bug show "${bugId}"`).toString();
      const existingSprints = bugInfo.match(/Sprint\d+/g) || [];

      existingSprints.forEach((s) => {
        try {
          execSync(`git-bug bug label rm "${bugId}" "${s}"`);
        } catch (e) {}
      });

      // 2. Neues Label setzen (Sprint 0 lassen wir ohne Label = Backlog)
      if (sprintNum > 0) {
        const newLabel = `Sprint${sprintNum.toString().padStart(2, "0")}`;
        execSync(`git-bug bug label new "${bugId}" "${newLabel}"`);
      }

      return true;
    } catch (e) {
      console.error("Backlog Write Error:", e.message);
      return false;
    }
  },
};
