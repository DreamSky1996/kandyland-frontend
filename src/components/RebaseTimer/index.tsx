import { useSelector } from "react-redux";
import { secondsUntilBlock, prettifySeconds } from "../../helpers";
import { Box } from "@material-ui/core";
import "./rebasetimer.scss";
import { Skeleton } from "@material-ui/lab";
import { useMemo } from "react";
import { IReduxState } from "../../store/slices/state.interface";

function RebaseKandyr() {
    const currentBlockKandy = useSelector<IReduxState, number>(state => {
        return state.app.currentBlockTime;
    });

    const nextRebase = useSelector<IReduxState, number>(state => {
        return state.app.nextRebase;
    });

    const timeUntilRebase = useMemo(() => {
        if (currentBlockKandy && nextRebase) {
            const seconds = secondsUntilBlock(currentBlockKandy, nextRebase);
            return prettifySeconds(seconds);
        }
    }, [currentBlockKandy, nextRebase]);

    return (
        <Box className="rebase-timer">
            <p>
                {currentBlockKandy ? (
                    timeUntilRebase ? (
                        <>
                            <strong>{timeUntilRebase}</strong> to Next Rebase
                        </>
                    ) : (
                        <strong>Rebasing</strong>
                    )
                ) : (
                    <Skeleton width="200px" />
                )}
            </p>
        </Box>
    );
}

export default RebaseKandyr;
