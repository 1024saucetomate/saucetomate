import { all as getCandidates, fromId as getCandidateFromId, randomGIF } from "./methods/get/candidates";
import {
  all as getPolicies,
  categories as getCategories,
  fromId as getPolicyFromId,
  random as getRandomPolicies,
} from "./methods/get/policies";
import { compute } from "./methods/get/score";

export default class MockAPI {
  static get = {
    candidates: {
      all: getCandidates,
      fromId: getCandidateFromId,
      randomGIF,
    },
    policies: {
      random: getRandomPolicies,
      fromId: getPolicyFromId,
      categories: getCategories,
      all: getPolicies,
    },
    score: {
      compute,
    },
  };
}
