import gql from "graphql-tag";

const missionQuery = gql`
  query Missions($shipId: ID!) {
    missions(shipId: $shipId) {
      active
      cargo
      destination
      id
      name
      shipId
    }
  }
`;

const query = { mission: missionQuery };
const mutations = {};
const Mission = { query, mutations };
export { Mission };
