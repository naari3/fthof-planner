import {
  Grid,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import ElderPredictor, { Step } from "../lib/ElderPredictor";

import GoldenCookieCell from "./GoldenCookieCell";

const zip3 = <T, U, V>(arrays: [T[], U[], V[]]): [T, U, V][] => {
  const len = arrays[0].length;
  const toReturn: [T, U, V][] = new Array(len);
  for (let i = 0; i < len; i++) {
    toReturn[i] = [arrays[0][i], arrays[1][i], arrays[2][i]];
  }
  return toReturn;
};

type Props = {
  seed: string;
  spellsCast: number;
  spellsCastTotal: number;
  loadAvatar: boolean;
};

export default function ComboSearcher({
  seed,
  spellsCast,
  spellsCastTotal,
  loadAvatar,
}: Props) {
  const [calculating, setCalculating] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [resultStep, setResultStep] = useState<Step>();
  const [spellOffset, setSpellOffset] = useState(0);

  const [clickFrenzy, setClickFrenzy] = useState(1);
  const [elderFrenzy, setElderFrenzy] = useState(1);
  const [buildingSpecial, setBuildingSpecial] = useState(1);

  const doCalc = () => {
    setResultStep(null);
    setNotFound(false);
    setCalculating(true);
  };

  useEffect(() => {
    if (!calculating) return;

    const f = async () => {
      const elderPredictor = new ElderPredictor({
        seed,
        spells: spellsCastTotal + 1,
        dragonFlight: false,
        supremeIntellect: false,
      });
      let count = 0;
      let found = false;
      for (const steps of elderPredictor) {
        count += 1;
        for (const step of steps) {
          const gcs = step.goldenCookies;
          if (
            gcs.filter((gc) => gc.force === "Elder frenzy").length ===
              elderFrenzy &&
            gcs.filter((gc) => gc.force === "Click Frenzy").length ===
              clickFrenzy &&
            gcs.filter((gc) => gc.force === "Building Special").length ===
              buildingSpecial
          ) {
            console.log(`found in ${count}`);
            console.log(step);
            found = true;
            setResultStep(step);
            setSpellOffset(count);
            break;
          }
        }
        if (found) break;

        if (count % 500 === 0) console.log(count);
        if (count > 5000) {
          console.log("not found in 5000 steps");
          setNotFound(true);
          break;
        }
      }

      setCalculating(false);
    };
    f();
  }, [calculating]);

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <TextField
            type="number"
            variant="outlined"
            label="Click Frenzy"
            value={clickFrenzy}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              min: 0,
            }}
            onChange={(e) => {
              setClickFrenzy(parseInt(e.target.value));
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            type="number"
            variant="outlined"
            label="Elder Frenzy"
            value={elderFrenzy}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              min: 0,
            }}
            onChange={(e) => {
              setElderFrenzy(parseInt(e.target.value));
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            type="number"
            variant="outlined"
            label="Building Special"
            value={buildingSpecial}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              min: 0,
            }}
            onChange={(e) => {
              setBuildingSpecial(parseInt(e.target.value));
            }}
          />
        </Grid>
        <Grid item>
          <Button
            onClick={doCalc}
            variant="contained"
            color="primary"
            fullWidth={true}
            disabled={
              clickFrenzy + elderFrenzy + buildingSpecial <= 0 ||
              clickFrenzy + elderFrenzy + buildingSpecial > 4 ||
              seed === "" ||
              calculating
            }
          >
            Search Combo
          </Button>
          {calculating ? "searching..." : ""}
        </Grid>
        <Grid item>
          {notFound ? "Not Found in 5000 steps. You should re-ascend." : ""}
        </Grid>
        {!notFound && resultStep ? (
          <>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Kind</TableCell>
                      <TableCell>Season</TableCell>
                      <TableCell>On Screan Cookies</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {zip3([
                      resultStep.goldenCookies,
                      resultStep.seasons,
                      resultStep.onScreens,
                    ]).map(([gc, season, onScrean], i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell key={`${i}_num`}>
                            {spellsCast + spellOffset + i + 1} (
                            {spellsCastTotal + spellOffset + i + 1})
                          </TableCell>
                          <GoldenCookieCell
                            gc={gc}
                            loadAvatar={loadAvatar}
                            index={`${i}_gc`}
                            key={`${i}_gc`}
                            highlight={
                              gc.force === "Click Frenzy" ||
                              gc.force === "Building Special" ||
                              gc.force === "Elder frenzy"
                            }
                          />
                          <TableCell key={`${i}_season`}>
                            {season === "easter" ? "Easter or Valentines" : ""}
                          </TableCell>
                          <TableCell key={`${i}_ons`}>{onScrean}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </>
        ) : (
          ""
        )}
      </Grid>
    </>
  );
}
