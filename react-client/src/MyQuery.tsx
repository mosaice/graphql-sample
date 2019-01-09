import { Query } from "react-apollo";
import * as React from "react";
import { Skeleton } from "antd";

export const MyQuery: React.SFC<any> = ({ query, children, ...ot }) => (
  <Query query={query} {...ot}>
    {({ loading, error, ...others }) => {
      if (loading) return <Skeleton active />;
      if (error) return <p>Error :(</p>;

      return children(others);
    }}
  </Query>
);
