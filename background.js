const MAIN_DB = "MAIN_DB", APPLIES_KEY = "applies", TAGS_KEY = "tags", SESSIONS_KEY = "sessions", SESSION_KEY = "session";

async function fetchAllEntities() {
    const db = await chrome.storage.sync.get([APPLIES_KEY, TAGS_KEY, SESSIONS_KEY, SESSION_KEY]);
    return db;
}

async function search({ query }) {
    let { applies, tags } = await fetchAllEntities(), results = { tags: [] };

    if (!applies || applies.length < 1) {
        await chrome.storage.sync.set({
            [APPLIES_KEY]: []
        });
    }
    if (!tags || tags.length < 1) {
        await chrome.storage.sync.set({
            [TAGS_KEY]: []
        });
    }


    tags.forEach(tag => {
        if (tag.value.toLowerCase().includes(query.toLowerCase()) || tag.name.toLowerCase().includes(query.toLowerCase())) {
            results.tags.push(tag);
        }
    });

    return results;
}

async function fetchAll() {
    let { applies, tags, sessions, session } = await fetchAllEntities();

    if (!applies || applies.length < 1) {
        await chrome.storage.sync.set({
            [APPLIES_KEY]: []
        });
    }
    if (!tags || tags.length < 1) {
        await chrome.storage.sync.set({
            [TAGS_KEY]: []
        });
    }

    return { applies, tags, sessions, session };
}

async function addTag({ name, value }) {
    let { tags } = await fetchAllEntities();
    tags.push({ name, value });
    await chrome.storage.sync.set({ tags })
}

async function getAllApplies() {
    const { applies } = await fetchAllEntities();
    return applies;
}

async function deleteAllApplies() {
    await chrome.storage.sync.set({ applies: [] })
}

async function addApply(apply) {
    let { applies } = await fetchAllEntities();
    applies.push(apply);
    await chrome.storage.sync.set({ applies })
}

async function createNewSession() {
    let { sessions, currentSession } = await fetchAllEntities();
    const newSession = {
        id: self.crypto.randomUUID()
    };

    sessions.push(newSession);
    currentSession = newSession;

    await chrome.storage.sync.set({ sessions, currentSession })
}

async function restoreLastSession() {
    let { sessions, currentSession } = await fetchAllEntities();
    currentSession = sessions[sessions.length];

    await chrome.storage.sync.set({ currentSession });
}

async function generateAppliesCSV() {
    let { applies } = await fetchAllEntities();
    //TODO
}

async function addTagToSession({name, value}){
    const {session} = await fetchAllEntities();
    if(session){
        const duplicate = session.tags.find(st=>st.name==name&&st.value==value);
        if(duplicate) return;
        session.tags.push({
            name,
            value
        });
        await chrome.storage.sync.set({ session });
    }

}

const funcionalities = {
    fetchAll,
    search,
    addTag,
    addApply,
    getAllApplies,
    deleteAllApplies,
    createNewSession,
    restoreLastSession,
    addTagToSession
}


chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});
chrome.tabs.onUpdated.addListener(async (tabId, tab) => { })
chrome.runtime.onMessage.addListener((request, sender, response) => {
    // console.log(request, sender, response);

    const { type, options } = request;
    funcionalities[type](options).then(response)
    return true;
})
