/**
 * Sample file to demonstrate auto-refactoring.
 */

export function processUser(user: { name: string; age: number }) { sharedHelper__se5gu("Starting user processing...", user, user); }

export function processAdmin(admin: { name: string; age: number }) { sharedHelper__se5gu("Starting admin processing...", admin, admin); }

function sharedHelper__se5gu(param2: any, param4: any, param7: any) {
    console.log(param2);
      const label = `User: ${param4.name}`;
      const validation = param7.age > 18 ? "Adult" : "Minor";
      console.log(`Status: ${validation} for ${label}`);
      return { label, validation };
}
