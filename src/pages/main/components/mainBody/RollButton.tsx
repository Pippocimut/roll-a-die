import type {Roll} from "../../types";
import {evaluate} from "mathjs";
import {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addRoll, type RollResult} from "../../../../store/history-sidebar/historySidebarSlice.ts";
import type {RootState} from "../../../../store";

type Props = {
    rolls: Roll[];
    name: string;
    deleteButton: () => void;
    editButton: () => void;
    color: string;
    tag?: number;
};

const calculateRolls = (rolls: Roll[]) => {
    const results: RollResult[] = [];

    for (const roll of rolls) {
        const {name, equation} = roll;

        let total = 0;
        let totalAdv = 0;
        let totalDis = 0;

        let normaledEquation = "";
        let advantageEquation = "";
        let disadvantageEquation = "";

        const equationComponents = equation
            .split(/(\s*[+\-*/()^]\s*)/g)
            .filter(Boolean)
            .map((component) => component.trim());

        for (const component of equationComponents) {
            if (component === " ") continue;
            if (component.includes("d")) {
                const [numberOfRolls, sides] = component.split("d").map(Number);
                normaledEquation += "( ";
                advantageEquation += "( ";
                disadvantageEquation += "( ";

                for (let i = 0; i < numberOfRolls; i++) {
                    const result1 = Math.floor(Math.random() * sides) + 1;
                    const result2 = Math.floor(Math.random() * sides) + 1;

                    if (i !== 0) {
                        normaledEquation += " + ";
                        advantageEquation += " + ";
                        disadvantageEquation += " + ";
                    }
                    normaledEquation += result1;
                    advantageEquation += Math.max(result1, result2);
                    disadvantageEquation += Math.min(result1, result2);
                }

                normaledEquation += " )";
                advantageEquation += " )";
                disadvantageEquation += " )";
            } else {
                normaledEquation += " " + component;
                advantageEquation += " " + component;
                disadvantageEquation += " " + component;
            }
        }

        total += evaluate(normaledEquation);
        totalAdv += evaluate(advantageEquation);
        totalDis += evaluate(disadvantageEquation);


        results.push({name, total, totalAdv, totalDis});
    }

    return results;
};

const RollButton = ({rolls, name, editButton, color, tag}: Props) => {
    const buttonHistory = useSelector((state: RootState) => state.historySidebar.rollHistory)
    const dispatch = useDispatch()

    const handleOnClick = useCallback(() => {
        const results: RollResult[] = calculateRolls(rolls);
        const date = new Date();

        dispatch(addRoll({
            name: name,
            color: color,
            tag: tag,
            date: date.toLocaleString(),
            rollResult: results,
        }))

    }, [buttonHistory]);

    return (
        <button
            className={`w-30 h-30 rounded-lg ${color} hover:outline-2 `}
            onClick={handleOnClick}
            onContextMenu={(e) => {
                e.preventDefault();
                editButton();
            }}
        >
            <span className={"text-xl"}>{name} </span>
        </button>
    );
};

export default RollButton;
