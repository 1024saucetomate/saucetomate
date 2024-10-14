import { all as getCandidates } from "./methods/get/candidates";
import { fromId as getPolicyFromId, random as getRandomPolicies } from "./methods/get/policies";

export default class MockAPI {
  static get = {
    candidates: getCandidates,
    policies: {
      random: getRandomPolicies,
      id: getPolicyFromId,
    },
  };
}
