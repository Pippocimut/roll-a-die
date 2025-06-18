import { RollButton } from "./components/RollButton";
import { useCallback, useState } from "react";
import { type ButtonData, useButtonList } from "../../data/buttonListDAO.ts";
import { type Tag } from "../../data/tagsDAO.ts";
import { CreateButtonDialog } from "./components/CreateButtonDialog";
import { EditButtonDialog } from "./components/EditButtonDialog";
import { TagsSideBar } from "./components/TagsSideBar";
import {
  useButtonPressedHistory,
  type ButtonPressRecord,
} from "../../data/rollHistoryDAO.ts";
import Sidebar from "./components/TagsSideBar/Sidebar.tsx";

export function Main() {
  const [buttonList, updateButtonList] = useButtonList();
  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false);
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag>();
  const [buttonHistory] = useButtonPressedHistory();

  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number | null>(
    null
  );

  const removeButton = useCallback(
    (index: number) => {
      updateButtonList(
        buttonList.filter((_: object, i: number) => i !== index)
      );
      setIsOpenEditDialog(false);
      setSelectedButtonIndex(null);
    },
    [buttonList]
  );

  const editButton = useCallback((index: number) => {
    setSelectedButtonIndex(index);
    setIsOpenEditDialog(true);
  }, []);

  return (
    <div className={"flex flex-row h-screen w-full justify-start items-start"}>
      <TagsSideBar selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
      <div
        className={
          "flex flex-col h-full gap-20 w-full items-center justify-around"
        }
      >
        <ul
          id="buttons"
          className={
            "flex flex-row flex-wrap gap-2 m-4 p-4 w-full justify-center items-center h-fit"
          }
        >
          {buttonList &&
            buttonList.map((buttonData: ButtonData, index: number) => {
              if (!selectedTag || buttonData.tag === selectedTag.name) {
                return (
                  <div className={"flex flex-row"} key={index}>
                    <RollButton
                      rolls={buttonData.rolls}
                      name={buttonData.name}
                      deleteButton={() => removeButton(index)}
                      editButton={() => editButton(index)}
                      color={buttonData.color}
                      tag={buttonData.tag}
                      key={index}
                    />
                  </div>
                );
              }
            })}
          <button
            className={
              "w-30 h-30 flex items-center justify-center bg-neutral-700 hover:outline-2 rounded-lg"
            }
            onClick={() => setIsOpenCreateDialog(true)}
          >
            <span className={"text-6xl pb-3"}>✚</span>
          </button>
        </ul>

        <CreateButtonDialog
          isOpen={isOpenCreateDialog}
          onClose={() => setIsOpenCreateDialog(false)}
          tag={selectedTag}
        />

        {selectedButtonIndex !== null ? (
          <EditButtonDialog
            isOpen={isOpenEditDialog}
            onClose={() => setIsOpenEditDialog(false)}
            button={buttonList[selectedButtonIndex]}
            deleteButton={() => {
              updateButtonList(
                buttonList.filter(
                  (_: object, i: number) => i !== selectedButtonIndex
                )
              );
              setIsOpenEditDialog(false);
            }}
          />
        ) : null}
      </div>
      <Sidebar direction={"right"}>
        <ul
          id="history"
          className={
            "flex flex-row flex-wrap gap-2 m-4 p-4 w-full justify-center items-center h-fit"
          }
        >
          {buttonHistory &&
            buttonHistory.map(
              (historyData: ButtonPressRecord, index: number) => {
                return (
                  <div
                    key={index}
                    className={
                      "p-4 m-4 text-white " +
                      historyData.color +
                      " h-fit max-w-80 text-left"
                    }
                  >
                    <h3 className={"mr-auto font-bold text-xl"}>
                      {historyData.name}
                    </h3>
                    <p>{historyData.tag}</p>
                  </div>
                );
              }
            )}
        </ul>
      </Sidebar>
    </div>
  );
}
