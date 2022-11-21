import { ref, computed, toRaw } from "vue";
import { defineStore } from "pinia";
import { ref as ref_db, set, get } from "firebase/database";
import { db } from "../firebase";
import { todayFormat } from "../helpers";

import { v4 as uuidv4 } from "uuid";

export const useSprintStore = defineStore("sprint", () => {
  const sprint = ref(null);
  const sprintId = ref("");
  const player = ref(null);
  const points = ref("");

  const getSprint = computed(() => {
    return sprint.value;
  });

  const getSprintId = computed(() => {
    if (!sprintId.value) {
      const t = JSON.parse(localStorage.getItem("tuteplanning"));
      if (t && typeof t.sprintId !== "undefined") {
        setSprintId(t.sprintId);
      }
    }
    return sprintId.value;
  });

  const canEditSprint = computed(() => {
    const canEdit = isCreator();
    if (sprint.value) {
      if (sprint.value.only_creator_edit && canEdit) {
        return true;
      }
      if (!sprint.value.only_creator_edit) {
        return true;
      }
    } else {
      return canEdit;
    }
    return false;
  });

  const canShowSprint = computed(() => {
    const canShow = isCreator();
    if (sprint.value) {
      if (sprint.value.only_creator_show && canShow) {
        return true;
      }
      if (!sprint.value.only_creator_show) {
        return true;
      }
    } else {
      return canShow;
    }
    return false;
  });


  const getPlayer = computed(() => {
    if (!player.value) {
      const t = JSON.parse(localStorage.getItem("tuteplanning"));
      if (t && typeof t.player !== "undefined") {
        setPlayer(t.player);
      }
    }
    return player.value;
  });

  const getStories = computed(() => {
    if (sprint.value) {
      return sprint.value.stories;
    }
    return null;
  });

  const getOpenStory = computed(() => {
    return open().story;
  });

  function setSprint(s) {
    sprint.value = s;
  }
  function setPlayer(newPlayer) {
    if (newPlayer) {
      const jsonValue = JSON.parse(localStorage.getItem("tuteplanning"));
      localStorage.setItem(
        "tuteplanning",
        JSON.stringify({ ...jsonValue, ...{ player: newPlayer } })
      );
      player.value = newPlayer;
    }
  }

  function setSprintId(sId) {
    sId = sId ? sId : "";
    const t = JSON.parse(localStorage.getItem("tuteplanning"));
    localStorage.setItem(
      "tuteplanning",
      JSON.stringify({ ...t, ...{ sprintId: sId } })
    );
    sprintId.value = sId;
  }

  function _createSprintLocal(sId) {
    const t = JSON.parse(localStorage.getItem("tuteplanning"));
    localStorage.setItem(
      "tuteplanning",
      JSON.stringify({ ...t, ...{ sprintId: sId, creator: 1 } })
    );
    sprintId.value = sId;
  }

  function setTempPoints(p) {
    let openStoryId = open().storyId;
    if (!openStoryId) {
      openStoryId ="";
    }
    const t = JSON.parse(localStorage.getItem("tuteplanning"));
    localStorage.setItem(
      "tuteplanning",
      JSON.stringify({
        ...t,
        ...{ lastVote: { storyId: openStoryId, points: p } },
      })
    );
    points.value = p;
  }

  const getLastVote =() => {
    const openStory = open().storyId;
    const jsonValue = JSON.parse(localStorage.getItem("tuteplanning"))
    if (typeof jsonValue !== 'undefined' && typeof jsonValue.lastVote !== 'undefined') {
      if (jsonValue.lastVote.storyId === openStory) {
        return jsonValue.lastVote.points ? jsonValue.lastVote.points : ""
      }
    }
    return ""
  }

  async function createSprint(newSprint, newPlayer) {
    const id = uuidv4();
    newSprint.date = todayFormat();
    try {
      sprint.value = null
      await set(ref_db(db, "sprints/" + id), newSprint);
      
      _createSprintLocal(id);

      setPlayer(newPlayer);
    } catch (e) {
      console.log(e);
    }
  }

  async function createPlayer(newPlayer) {
    const openStory = open().storyId;
    if (!openStory) {
      return;
    }
    if (!newPlayer) {
      return;
    }
    try {
      await set(
        ref_db(
          db,
          `sprints/${sprintId.value}/stories/${openStory}/players/${newPlayer}`
        ),
        {
          points: "",
          voted: 0,
          is_creator: 0,
        }
      );
      setPlayer(newPlayer);
    } catch (e) {
      console.log(e);
    }
  }

  async function createNewStory(newStory) {
    const storyId = uuidv4();
    try {
      await _closeAllStories();
      const data = {
        title: newStory.title,
        url: newStory.url,
        date: todayFormat(),
        open: 1,
        show: 0,
        players: {
          [player.value]: {
            voted: 0,
            points: "",
            is_creator: 0,
          },
        },
      };
      await set(
        ref_db(db, `sprints/${sprintId.value}/stories/${storyId}`),
        data
      );
    } catch (e) {
      console.log(e);
    }
  }

  async function setSprintData(s) {
    sprint.value.name = s.name;
    sprint.value.only_creator_edit = s.only_creator_edit === "1" ? 1: 0
    sprint.value.only_creator_show = s.only_creator_show === "1" ? 1: 0
    try {
      await set(ref_db(db, `sprints/${sprintId.value}`), sprint.value);
    } catch (e) {
      console.log(e);
    }
  }

  async function setScore(storyId, score) {
    try {
      await set(
        ref_db(db, `sprints/${sprintId.value}/stories/${storyId}/score/`),
        score
      );
    } catch (e) {
      console.log(e);
    }
  }

  async function setStory(storyId, s) {
    try {
      await set(
        ref_db(db, `sprints/${sprintId.value}/stories/${storyId}/title/`),
        s.title
      );
      await set(
        ref_db(db, `sprints/${sprintId.value}/stories/${storyId}/url/`),
        s.url
      );
    } catch (e) {
      console.log(e);
    }
  }

  async function sendVote(points) {
    const openStory = open();
    if (!openStory.storyId) {
      return;
    }
    const playersStory = openStory.story.players;
    let send = true;
    Object.entries(playersStory).forEach((p) => {
      const [key, value] = p;
      if (key === player.value) {
        if (openStory.story.show && value.points === points) {
          send = false;
        } else if (!openStory.story.show && value.points === "") {
          send = false;
        }
        if (!value.voted) {
          send = true;
        }
      }
    });
    if (!send) {
      return;
    }
    const voted = points !== "-" && points !== '' ? 1 : 0;
    points = points !== "-" ? points : "";
    try {
      await set(
        ref_db(
          db,
          `sprints/${sprintId.value}/stories/${openStory.storyId}/players/${player.value}`
        ),
        {
          points: openStory.story.show ? points : "",
          voted: voted,
          is_creator: 0,
        }
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  async function showPoints(show) {
    show = !show;
    const openStory = open();
    if (!openStory.storyId) {
      return;
    }

    try {
      await set(
        ref_db(
          db,
          `sprints/${sprintId.value}/stories/${openStory.storyId}/show`
        ),
        show ? 1 : 0
      );
      if (!show) {
        const playersStory = openStory.story.players;
        Object.entries(playersStory).forEach(async (p) => {
          const [key, value] = p;
          playersStory[key].points = "";
        });
        await set(
          ref_db(
            db,
            `sprints/${sprintId.value}/stories/${openStory.storyId}/players`
          ),
          playersStory
        );
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  async function clearVotes(){
    const openStory = open();
    if (openStory.storyId) {
      const playersStory = openStory.story.players;
        Object.values(playersStory).forEach((p) => {
          p.points = "-";
          p.voted = 0;
        });
        openStory.story.show=0;
        try{
        await set(
          ref_db(
            db,
            `sprints/${sprintId.value}/stories/${openStory.storyId}`
          ),
          openStory.story
        );
          }
          catch(e){
            console.log(e)
          }
      }
  }
  async function voteAgain(storyId) {
    try {
      await _closeAllStories(storyId);
      await clearVotes();
    } catch (e) {
      console.log(e);
    }
  }

  async function sprintExists(id) {
    try {
      const sprint = await get(ref_db(db, "/sprints/" + id));
      if (sprint.exists()) {
        return sprint.val();
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  async function deletePlayer(playerToDelete) {
    const openStory = open();
    if (!openStory) {
      return;
    }

    try {
      const playersStory = openStory.story.players;
      delete playersStory[playerToDelete];
      await set(
        ref_db(
          db,
          `sprints/${sprintId.value}/stories/${openStory.storyId}/players`
        ),
        playersStory
      );
    } catch (e) {
      console.log(e);
    }
  }

  async function _closeAllStories(storyId) {
    storyId = typeof storyId !== 'undefined' ? storyId : "";
    if (sprint.value && sprint.value.stories) {
      const stories_arr = sprint.value.stories;
      Object.entries(stories_arr).forEach(async (s) => {
        const [key, value] = s;
        value.open = key === storyId ? 1 : 0;
      });
      
      try{
        await set(
          ref_db(db, `sprints/${sprintId.value}`),
          sprint.value
        );
      }
      catch(e){
        console.log(e)
      }
    }
  }

  function open() {
    if (sprint.value && sprint.value.stories) {
      const stories_arr = sprint.value.stories;
      let story = { storyId: null, story: {} };
      Object.entries(stories_arr).forEach((s) => {
        const [key, value] = s;
        if (value && value.open === 1) {
          story = { storyId: key, story: value };
        }
      });

      return story;
    }
    return null;
  }

  function playerExists(playerName) {
    let exists = false;
    if (sprint.value && sprint.value.stories) {
      const stories_arr = sprint.value.stories;
      let story = { storyId: null, story: {} };
      Object.entries(stories_arr).forEach((s) => {
        const [key, value] = s;
        if (value && value.open === 1) {
          story = { storyId: key, story: value };
          Object.entries(value.players).forEach((p) => {
            const [key] = p;
            if (key === playerName) {
              exists = true;
            }
          });
        }
      });
    }
    return exists;
  }

  function isCreator() {
    const t = JSON.parse(localStorage.getItem("tuteplanning"));
    if (t && typeof t.creator !== "undefined" && t.creator) {
      return true;
    }
    return false;
  }

  return {
    getSprintId,
    getStories,
    getPlayer,
    getSprint,
    getOpenStory,
    getLastVote,
    open,
    setSprint,
    setSprintData,
    setSprintId,
    setPlayer,
    createSprint,
    setStory,
    setScore,
    setTempPoints,
    showPoints,
    createNewStory,
    createPlayer,
    sendVote,
    voteAgain,
    clearVotes,
    deletePlayer,
    sprintExists,
    playerExists,
    isCreator,
    canEditSprint,
    canShowSprint,
  };
});
