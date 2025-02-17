document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("costumeTableBody");
    const totalGuests = document.getElementById("totalGuests");
    const guestListHeader = document.querySelector("h1.text");
    let guestCount = 0;
    let guests = {};

    document.getElementById("addEntryButton").addEventListener("click", addEntry);

    function addEntry() { //create Text entries by using a dict to store the entries
        const name = document.getElementById("nameInput").value;
        const costume = document.getElementById("costumeInput").value;
        if (!name || !costume) {
            alert("Please enter both name and costume."); //Needs both name and costume to be entered
            return;
        }

        const entryKey = `${name}-${costume}`;
        if (guests[entryKey]) { //If the entry already exists, in the guest dict then alert the user
            alert("This entry already exists.");
            return;
        }

        const row = document.createElement("tr"); 
        row.innerHTML = `
            <td>${name}</td>
            <td>${costume}</td>
            <td class="likes-column">
                <span class="votes">0</span>
                <button class="thumbs-up">👍</button>
                <button class="thumbs-down">👎</button>
                <button class="remove">❌</button>
            </td>
        `;

        tableBody.appendChild(row);
        guests[entryKey] = { row, votes: 0 }; //If not then add the entry to the guest dict
        guestCount++; //creates guest count
        updateTotalGuests(); //create function to do this

        document.getElementById("nameInput").value = "";
        document.getElementById("costumeInput").value = "";

        row.querySelector(".thumbs-up").addEventListener("click", () => vote(entryKey, 1));
        row.querySelector(".thumbs-down").addEventListener("click", () => vote(entryKey, -1));
        row.querySelector(".remove").addEventListener("click", () => removeEntry(entryKey));
    }

    function updateTotalGuests() { //Updates the total number of guests with the Text entries
        totalGuests.textContent = `(${guestCount})`;
        guestListHeader.innerHTML = `Halloween Guest List <span id="totalGuests">(${guestCount})</span>`;
    }

    function vote(entryKey, change) { //Function to vote for the guest
        let votedGuests = JSON.parse(localStorage.getItem('votedGuests')) || {};

        if (votedGuests[entryKey]) {
            alert("You have already voted for this guest.");
            return;
        }

        votedGuests[entryKey] = true;
        localStorage.setItem('votedGuests', JSON.stringify(votedGuests));

        const guest = guests[entryKey];
        guest.votes += change;
        guest.row.querySelector(".votes").textContent = guest.votes;
        updateMostVotesGuest();
    }

    function removeEntry(entryKey) {
        const guest = guests[entryKey];
        tableBody.removeChild(guest.row);
        delete guests[entryKey];
        guestCount--;
        updateTotalGuests();
        updateMostVotesGuest(); //Updates the most votes guest
    }

    function updateMostVotesGuest() {
        let maxVotes = -1;
        let topGuest = "None";
        let topGuestRow = null;

        // Remove highlight from all rows
        for (const key in guests) {
            guests[key].row.classList.remove("highlight");
            const nameCell = guests[key].row.querySelector(".name");
            nameCell.textContent = nameCell.textContent.replace(/🍬/g, '').trim();
        }

        // Find the guest with the most votes
        for (const key in guests) {
            if (guests[key].votes > maxVotes) {
                maxVotes = guests[key].votes;
                topGuest = key.split('-')[0];
                topGuestRow = guests[key].row;
            }
        }

        // Highlight the row with the most votes
        if (topGuestRow) {
            topGuestRow.classList.add("highlight");
            const nameCell = topGuestRow.querySelector(".name");
            nameCell.textContent = `🍬 ${nameCell.textContent} 🍬`;
        }

        mostVotesGuest.textContent = topGuest;
    }
});