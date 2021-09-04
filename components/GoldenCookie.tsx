import { Grid, Avatar, Typography } from "@mui/material";

import { GoldenCookieType } from "../lib/GoldenCookie";

type Props = {
  gc: GoldenCookieType;
  loadAvatar: boolean;
  highlight: boolean;
};

export default function GoldenCookie({ gc, loadAvatar, highlight }: Props) {
  return (
    <>
      <Grid item>
        {loadAvatar ? (
          <Avatar src={gc.wrath ? "/WrathCookie.png" : "/GoldenCookie.png"} />
        ) : (
          ""
        )}
      </Grid>
      <Grid item>
        <Typography style={highlight ? { color: "white" } : {}} align="center">
          {gc.force}
        </Typography>
      </Grid>
    </>
  );
}
