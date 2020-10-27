browser.runtime.onMessage.addListener(() => {
    toggleSidebar();
    return Promise.resolve({
        response: "Msg from content script.",
    });
});

const toggleSidebar = () => {
    const hnmain = document.getElementById("hnmain");
    const linksDiv = document.getElementsByClassName("linksDiv")[0];
    if (hnmain.align == "left") {
        linksDiv.style.display = "none";
        hnmain.width = "85%";
        hnmain.align = "center";
    } else {
        linksDiv.style.display = "initial";
        hnmain.width = "70%";
        hnmain.align = "left";
    }
};



const fetchSearchResultsAndAppend = async (queryURL, previousStories) => {
    try {
        const response = await fetch(queryURL);
        const data = await response.json();
        if (await data["nbHits"]) {
            let previousSection = document.createElement("details");
            previousSection.className = "previousSection";
            let summary = document.createElement("summary");
            summary.innerHTML = "elsewhere on HN";
            previousSection.appendChild(summary);

            let linksList = document.createElement("li");

            for (let item of data["hits"]) {
                let linkTitle = item["title"];
                let numComments = item["num_comments"];
                let points = item["points"];
                let hnCommentsURL =
                    "https://news.ycombinator.com/item?id=" + item["objectID"];

                let urlElement = document.createElement("a");
                urlElement.title = linkTitle;
                urlElement.href = hnCommentsURL;
                urlElement.target = "_blank";
                urlElement.className = "urlElement";

                let urlPoints = document.createElement("text");
                urlPoints.textContent =
                    "▲ " + points;

                // urlPoints.innerHTML =
                // "<span>▲ " + points + "</span>";

                urlPoints.className = "urlPoints";


                let urlComments = document.createElement("text");
                urlComments.textContent =
                    "🗩 " + numComments;

                urlComments.className = "urlComments";

                urlElement.textContent = linkTitle;

                // let urlText = document.createTextNode(linkTitle);
                // urlElement.appendChild(urlText);

                let urlElementP = document.createElement("p");

                urlElementP.appendChild(urlElement);
                urlElementP.appendChild(urlPoints);
                urlElementP.appendChild(urlComments);

                previousSection.appendChild(urlElementP);
            }

            previousStories.appendChild(previousSection);
        }
    } catch (err) {
        console.log(err);
    }
};

const createLinksArray = () => {
    let linksArray = [];

    // Select all elements inside commtext classes whose href attribute begins with "http"
    // This selects for both http and https links
    let links = document.querySelectorAll('.commtext a[href^="http"]');

    for (let i = 0, max = links.length; i < max; i++) {
        idOfClosestParent = links[i].closest(".comtr").id;


        textOfComment = document
            .getElementById(idOfClosestParent)
            .getElementsByClassName("commtext")[0].innerText;

        // If it is a multiline comment the innerText contains "reply". We remove that.
        if (textOfComment.endsWith("reply")) {
            textOfComment = textOfComment.slice(0, -7);
        }

        linksArray.push({
            link: links[i].href,
            idOfClosestParent: idOfClosestParent,
            commentText: textOfComment,
        });
    }

    // Sort the Array so that same domains are grouped together.
    linksArray.sort((a, b) => {
        return a.link.localeCompare(b.link);
    });
    return linksArray;
};

function createLinksArrayElement(linksArray) {
    const linksDiv = document.createElement("div");
    linksDiv.className = "linksDiv";

    // The instructions Header
    const instructionsText = document.createTextNode(
        "Click on a comment text to focus on that comment in the thread. If a link has been posted as a HN story before, click on 'Elsewhere on HN' to see those."
    );

    linksDiv.appendChild(instructionsText);

    // One horizontal separator
    const hr = document.createElement("hr");
    linksDiv.appendChild(hr);

    for (let i = 0; i < linksArray.length; i++) {
        let linkBlock = document.createElement("div");
        let parentCommentID = linksArray[i]["idOfClosestParent"];

        let linkHeader = document.createElement("a");
        // let linkText = document.createTextNode(linksArray[i]["link"]);

        // linkHeader.textContent = (i+1) + ". " + linksArray[i]["link"];
        linkHeader.textContent = linksArray[i]["link"];
        // linkHeader.appendChild(linkText);
        linkHeader.title = linksArray[i]["link"];
        linkHeader.href = linksArray[i]["link"];
        linkHeader.target = "_blank";

        linkBlock.appendChild(linkHeader);

        let linkComment = document.createElement("p");
        linkComment.className = "linkComment";
        linkComment.textContent = linksArray[i]["commentText"];

        // let linkCommentText = document.createTextNode(linksArray[i]["commentText"]);
        // linkComment.appendChild(linkCommentText);
        linkComment.onclick = function() {
            document.getElementById(parentCommentID).scrollIntoView();
        };

        linkBlock.appendChild(linkComment);

        let previousStories = document.createElement("div");
        previousStories.className = "previousStories";

        url = linksArray[i]["link"].split("#")[0];
        queryURL =
            "http://hn.algolia.com/api/v1/search?query=" +
            url +
            "&tags=story&restrictSearchableAttributes=url";
        // console.log(queryURL);

        // FIXME this only retrives the first 20 search results (which is fine for the time being, I think)
        fetchSearchResultsAndAppend(queryURL, previousStories);

        linksDiv.appendChild(linkBlock);
        linksDiv.appendChild(previousStories);
    }
    document.body.appendChild(linksDiv);
}

const linksArray = createLinksArray();
createLinksArrayElement(linksArray);
toggleSidebar();

// Ellipsify the comment texts to three lines

$readMoreJS.init({
    target: ".linkComment",
    numOfWords: 40, // Number of words to initially display.
    toggle: true, // If true, user can toggle between 'read more' and 'read less'
    moreLink: "more...", // The text of 'Read more' link.
    lessLink: "less", // The text of 'Read less' link.
    linkClass: "rm-link", // The class given to the read more link.
    containerClass: "rm-container", // The class given to the div container of the read more link.
});
