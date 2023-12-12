import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { SideNavDashboard } from "../components/SideNavDashboard";
import FavoriteMedia from "../components/FavoriteMedia";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import { useEffect, useState } from "react";

export const FavoritesPage = () => {
  //const [isReloaded, setIsReloaded] = useState(false);
  // window.location.reload()

  return (
    <div>
      <Box sx={{ marginTop: "3rem" }}></Box>
      <Grid
        container
        direction="column"
        justifyContent="center"
        sx={{ paddingY: "4rem" }}
      >
        <Grid container direction="row" justifyContent="center">
          <FavoriteMedia />
        </Grid>
        {/*<Grid container direction="row" justifyContent="center">
          <FavoriteMedia />
        </Grid>
        <Grid container direction="row" justifyContent="center">
          <FavoriteMedia />
  </Grid>*/}
      </Grid>
      <Box sx={{ marginBottom: "3rem" }}></Box>
    </div>
  );
};

// sx={{
//   overflow: 'hidden',
//   gridAutoFlow: 'column',
//   gridTemplateColumns:
//     'repeat(auto-fit, minmax(160px,1fr)) !important',
//   gridAutoColumns: 'minmax(160px, 1fr)',
//   mt: 4,
//   mb: 4,
//   gridTemplateRows: 'minmax(240px, 1fr)',
// }}
