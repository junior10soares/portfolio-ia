import { shouldTrack } from "../lib/db/supabase/page-views";

process.env.EXCLUDED_IPS = "1.2.3.4, 5.6.7.8";

console.assert(shouldTrack("8.8.8.8") === true, "IP de visitante deveria ser contado");
console.assert(shouldTrack("1.2.3.4") === false, "IP excluído não deveria ser contado");
console.assert(shouldTrack("unknown") === false, "sem header de IP (dev local) não deveria contar");

console.log("page-views self-check ok");
