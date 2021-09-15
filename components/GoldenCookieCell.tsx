import { Grid, TableCell, useTheme } from "@mui/material";

import GoldenCookie from "./GoldenCookie";
import { GoldenCookieType } from "../lib/GoldenCookie";

type Props = {
  gc: GoldenCookieType;
  loadAvatar: boolean;
  highlight: boolean;
  index: string;
};

export default function GoldenCookieCell({
  gc,
  loadAvatar,
  highlight,
  index,
}: Props) {
  const theme = useTheme();

  return (
    <TableCell
      key={index}
      style={
        highlight
          ? {
              backgroundColor:
                gc.force !== "Elder frenzy"
                  ? theme.palette.warning.main
                  : theme.palette.secondary.main,
            }
          : {}
      }
    >
      <Grid container spacing={2} alignItems="center">
        <GoldenCookie gc={gc} loadAvatar={loadAvatar} highlight={highlight} />
      </Grid>
    </TableCell>
  );
}
