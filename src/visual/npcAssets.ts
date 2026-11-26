/** Measured PNG dimensions and bottom-center placement anchors. */
export const npcAssets = {
  "student-m01": {"category":"students","path":"assets/npcs/students/student-m01/standing.png","size":[193,731],"foot":[96.5,731]},
  "student-m02": {"category":"students","path":"assets/npcs/students/student-m02/standing.png","size":[180,684],"foot":[90.0,684]},
  "student-m03": {"category":"students","path":"assets/npcs/students/student-m03/standing.png","size":[213,676],"foot":[106.5,676]},
  "student-f01": {"category":"students","path":"assets/npcs/students/student-f01/standing.png","size":[170,652],"foot":[85.0,652]},
  "student-f02": {"category":"students","path":"assets/npcs/students/student-f02/standing.png","size":[163,603],"foot":[81.5,603]},
  "student-f03": {"category":"students","path":"assets/npcs/students/student-f03/standing.png","size":[170,675],"foot":[85.0,675]},
  "knight-01": {"category":"knights","path":"assets/npcs/knights/knight-01/standing.png","size":[290,710],"foot":[145.0,710]},
  "knight-02": {"category":"knights","path":"assets/npcs/knights/knight-02/standing.png","size":[264,579],"foot":[132.0,579]},
  "knight-03": {"category":"knights","path":"assets/npcs/knights/knight-03/standing.png","size":[327,663],"foot":[163.5,663]},
  "knight-04": {"category":"knights","path":"assets/npcs/knights/knight-04/standing.png","size":[251,565],"foot":[125.5,565]},
  "cleric-01": {"category":"clerics","path":"assets/npcs/clerics/cleric-01/standing.png","size":[277,722],"foot":[138.5,722]},
  "cleric-02": {"category":"clerics","path":"assets/npcs/clerics/cleric-02/standing.png","size":[251,690],"foot":[125.5,690]},
  "cleric-03": {"category":"clerics","path":"assets/npcs/clerics/cleric-03/standing.png","size":[193,622],"foot":[96.5,622]},
  "cleric-04": {"category":"clerics","path":"assets/npcs/clerics/cleric-04/standing.png","size":[280,662],"foot":[140.0,662]},
} as const;
export type NPCId = keyof typeof npcAssets;
