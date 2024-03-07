import gql from "graphql-tag";

const shipsQuery = gql`
  query Query($input: ShipsInput!) {
    ships(input: $input) {
      active
      class
      id
      image
      name
    }
  }
`;

const query = { ships: shipsQuery };
const mutations = {};
const Ships = { query, mutations };
export { Ships };
