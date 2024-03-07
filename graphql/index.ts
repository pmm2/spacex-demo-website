import { Ships } from "./ships";
import { Mission } from "./mission";
const apiCalls = {
  queries: {
    ...Ships.query,
    ...Mission.query,
  },
  mutations: {
    ...Ships.mutations,
  },
};

export default apiCalls;
