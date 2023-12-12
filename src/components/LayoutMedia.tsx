import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import { ChildrenProps } from "../shared/types";

export const LayoutMedia = ({ children }: ChildrenProps) => {
  return (
    <div>
      <Box sx={{ marginTop: "3rem" }}></Box>
      <Grid
        container
        direction="column"
        justifyContent="center"
        sx={{ paddingY: "4rem" }}
      >
        {children}
      </Grid>
      <Box sx={{ marginBottom: "3rem" }}></Box>
    </div>
  );
};
