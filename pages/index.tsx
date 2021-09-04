import Head from "next/head";
import Layout from "../components/layout";
import { TextField, Button } from "@mui/material";
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Paper,
} from "@mui/material";
import { FormControlLabel, Checkbox, useTheme } from "@mui/material";
import { Grid } from "@mui/material";

import { useEffect, useState } from "react";
import base64 from "base64-js";
import type { GoldenCookieType } from "../lib/GoldenCookie";
import { checkCookies } from "../lib/fthofCheck";
import GoldenCookieCell from "../components/GoldenCookieCell";

export default function Home() {
  const [rawSavedata, setRawSavedata] = useState("");
  const [savedata, setSavedata] = useState("");
  const [isError, setIsError] = useState(false);
  const [loadAvatar, setLoadAvatar] = useState(false);
  const [goldenCookies, setGoldenCookies] = useState<
    [GoldenCookieType, GoldenCookieType][]
  >([]);
  const [lookahead, setLookahead] = useState(10);
  const [spellsCastTotal, setSpellsCastTotal] = useState(0);
  const [spellsCast, setSpellsCast] = useState(0);
  const [onScreenCookies, setOnScreenCookies] = useState(0);
  const [isDragonFlight, setIsDragonFlight] = useState(false);

  const decodeSavedata = () => {
    try {
      const decoded = new TextDecoder().decode(
        base64.toByteArray(decodeURIComponent(rawSavedata).split("!END!")[0])
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
      const _spellsCast = parseInt(data[5].split(";")[7].split(" ")[1]);
      const _spellsCastTotal = parseInt(data[5].split(";")[7].split(" ")[2]);
      console.log({ data, seed, ascensionMode, _spellsCastTotal });

      setSpellsCast(_spellsCast);
      setSpellsCastTotal(_spellsCastTotal);

      const defaultOptions = {
        seed,
        onScreenCookies: onScreenCookies || 0,
        ascensionMode,
        dragonFlight: isDragonFlight,
      };

      setGoldenCookies(
        [...Array(lookahead || 0)].map((_, i) => {
          return [
            checkCookies({
              ...defaultOptions,
              spells: _spellsCastTotal + i,
              season: "",
            }),
            checkCookies({
              ...defaultOptions,
              spells: _spellsCastTotal + i,
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
            helperText={isError && "Invalid savedata"}
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
          <p>No Change: Plain state</p>
          <p>One Change: Season is Easter or Valentines</p>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>No Change</TableCell>
                  <TableCell>One Change</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {goldenCookies.map((gcs, i) => {
                  return (
                    <TableRow key={i}>
                      {[
                        <TableCell key={`${i}_num`}>
                          {i + 1 + spellsCast} ({spellsCastTotal + i + 1})
                        </TableCell>,
                      ].concat(
                        gcs.map((gc, j) => (
                          <GoldenCookieCell
                            gc={gc}
                            loadAvatar={loadAvatar}
                            index={`${i}_${j}`}
                            key={`${i}_${j}`}
                            highlight={gc.force == "Click Frenzy"}
                          />
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
