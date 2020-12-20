import Head from "next/head";
import Layout from "../components/layout";
import { TextField, Button } from "@material-ui/core";
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Paper,
  Avatar,
} from "@material-ui/core";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import { Grid } from "@material-ui/core";

import { useEffect, useState } from "react";
import seedrandom from "seedrandom";
import base64 from "base64-js";
import choose from "../lib/choose";
import { getGoldenCookie } from "../lib/GoldenCookie";
import type { GoldenCookie } from "../lib/GoldenCookie";

const checkCookies = ({
  seed,
  spells,
  season,
  onScreenCookies,
  dragonFlight,
}: {
  seed: string;
  spells: number;
  season: string;
  onScreenCookies: number;
  ascensionMode: number;
  dragonFlight: boolean;
}): GoldenCookie => {
  const srnd = seedrandom(`${seed}/${spells}`);
  const roll = srnd();
  let force: string = null;
  if (roll < 1 - 0.15 * (onScreenCookies + 1)) {
    // Game.shimmerTypes.golden.initFunc
    // if (chime && ascensionMode !== 1) srnd();
    if (season === "valentines" || season === "easter") srnd();
    srnd();
    srnd();
    // Game.shimmerTypes.golden.initFunc end

    const choices = ["frenzy", "multiply cookies"];
    if (!dragonFlight) choices.push("click frenzy");
    if (srnd() < 0.1) choices.push("cookie storm", "cookie storm", "blab");
    if (srnd() < 0.25) choices.push("building special");
    if (srnd() < 0.15) {
      while (choices.length > 0) {
        choices.pop();
      }
      choices.push("cookie storm drop");
    }
    if (srnd() < 0.0001) choices.push("free sugar lump");
    force = choose(choices, srnd);
  } else {
    // Game.shimmerTypes.golden.initFunc
    // if (chime && ascensionMode !== 1) srnd();
    if (season === "valentines" || season === "easter") srnd();
    srnd();
    srnd();
    // Game.shimmerTypes.golden.initFunc end

    const choices = ["clot", "ruin cookies"];
    if (srnd() < 0.1) choices.push("cursed finger", "blood frenzy");
    if (srnd() < 0.003) choices.push("free sugar lump");
    if (srnd() < 0.1) {
      while (choices.length > 0) {
        choices.pop();
      }
      choices.push("blab");
    }
    force = choose(choices, srnd);
  }

  return getGoldenCookie(force);
};

export default function Home() {
  const [rawSavedata, setRawSavedata] = useState("");
  const [savedata, setSavedata] = useState("");
  const [isError, setIsError] = useState(false);
  const [loadAvatar, setLoadAvatar] = useState(false);
  const [goldenCookies, setGoldenCookies] = useState<
    [GoldenCookie, GoldenCookie][]
  >([]);
  const [lookahead, setLookahead] = useState(10);
  const [onScreenCookies, setOnScreenCookies] = useState(0);
  const [isDragonFlight, setIsDragonFlight] = useState(false);

  const decodeSavedata = () => {
    try {
      const decoded = new TextDecoder().decode(
        base64.toByteArray(rawSavedata.split("%21END%21")[0])
      );
      setSavedata(decoded);
      setIsError(false);
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  useEffect(() => {
    if (savedata === "") return;
    try {
      const data = savedata.split("|");
      const seed = data[2].split(";")[4];
      const ascensionMode = parseInt(data[4].split(";")[29]);
      const spellsCastTotal = parseInt(data[5].split(";")[7].split(" ")[2]);
      console.log({ data, seed, ascensionMode, spellsCastTotal });

      const defaultOptions = {
        seed,
        onScreenCookies,
        ascensionMode,
        dragonFlight: isDragonFlight,
      };

      setGoldenCookies(
        [...Array(lookahead)].map((_, i) => {
          return [
            checkCookies({
              ...defaultOptions,
              spells: spellsCastTotal + i,
              season: "",
            }),
            checkCookies({
              ...defaultOptions,
              spells: spellsCastTotal + i,
              season: "easter",
            }),
          ];
        })
      );
      setIsError(false);
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  }, [savedata, lookahead, onScreenCookies, isDragonFlight]);

  return (
    <Layout>
      <Head>
        <title>FtHoF Planner</title>
      </Head>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={11}>
          <TextField
            placeholder="savedata"
            error={isError}
            fullWidth={true}
            onChange={(e) => setRawSavedata(e.target.value)}
          />
        </Grid>
        <Grid item xs={1}>
          <Button
            onClick={decodeSavedata}
            variant="contained"
            color="primary"
            fullWidth={true}
          >
            GO
          </Button>
        </Grid>
        <Grid item>
          <TextField
            type="number"
            variant="outlined"
            label="Lookahead"
            value={lookahead}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              min: 0,
            }}
            onChange={(e) => {
              setLookahead(parseInt(e.target.value));
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            type="number"
            variant="outlined"
            label="On Screen GoldenCookies"
            value={onScreenCookies}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              min: 0,
            }}
            onChange={(e) => {
              setOnScreenCookies(parseInt(e.target.value));
            }}
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                checked={isDragonFlight}
                onChange={(e) => {
                  setIsDragonFlight(e.target.checked);
                }}
              />
            }
            label="DragonFlight Activated"
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                checked={loadAvatar}
                onChange={(e) => {
                  setLoadAvatar(e.target.checked);
                }}
              />
            }
            label="Load Cookie Avatar"
          />
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>A</TableCell>
                  <TableCell>B</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {goldenCookies.map((gcs, i) => {
                  return (
                    <TableRow key={i}>
                      {[<TableCell key={`${i}_num`}>{i + 1}</TableCell>].concat(
                        gcs.map((gc, j) => (
                          <TableCell key={`${i}_${j}`}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item>
                                {loadAvatar ? (
                                  <Avatar
                                    src={
                                      gc.wrath
                                        ? "/WrathCookie.png"
                                        : "/GoldenCookie.png"
                                    }
                                  />
                                ) : (
                                  ""
                                )}
                              </Grid>
                              <Grid item>{gc.force}</Grid>
                            </Grid>
                          </TableCell>
                        ))
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={() => {
              setLookahead(lookahead + 10);
            }}
            variant="contained"
            color="primary"
          >
            Load more
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
}
