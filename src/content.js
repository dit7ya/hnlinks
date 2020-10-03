browser.runtime.onMessage.addListener(request => {
    toggle();
    return Promise.resolve({
        response: "Msg from content script."
    });
});

function toggle() {
    if (document.getElementById("hnmain").align == "left") {

        document.getElementsByClassName("linksDiv")[0].style.display = "none";
        document.getElementById("hnmain").width = "85%";
        document.getElementById("hnmain").align = "center";
    } else {

        document.getElementsByClassName("linksDiv")[0].style.display = "initial";
        document.getElementById("hnmain").width = "70%";
        document.getElementById("hnmain").align = "left";
    }

}

const linksArray = createLinksArray();
createLinksArrayElement(linksArray);
toggle();


function createLinksArray() {
    let linksArray = [];

    // Select all a elements inside commtext classes whose href attribute begins with "https"
    let links = document.querySelectorAll('.commtext a[href^="https"]');

    for (let i = 0, max = links.length; i < max; i++) {

        idOfClosestParent = links[i].closest(".comtr").id;
        textOfComment = document
            .getElementById(idOfClosestParent)
            .getElementsByClassName("commtext")[0]
            .innerText.slice(0, -7); // slicing to get rid of the 'reply' text

        linksArray.push({
            link: links[i].href,
            idOfClosestParent: idOfClosestParent,
            commentText: textOfComment,
        });
    }

    linksArray.sort((a, b) => a.link.localeCompare(b.link));
    return linksArray;
}

function createLinksArrayElement(linksArray) {
    const linksDiv = document.createElement("div");
    linksDiv.className = "linksDiv";

    const instructionsText = document.createTextNode(
        "Click on a comment text to focus on that comment in the thread. "
    );

    linksDiv.appendChild(instructionsText);

    const hr = document.createElement("hr");
    linksDiv.appendChild(hr);

    for (let i = 0; i < linksArray.length; i++) {
        let linkBlock = document.createElement("div");
        let parentCommentID = linksArray[i]["idOfClosestParent"];

        let linkHeader = document.createElement("a");
        let linkText = document.createTextNode(linksArray[i]["link"]);

        linkHeader.appendChild(linkText);
        linkHeader.title = linksArray[i]["link"];
        linkHeader.href = linksArray[i]["link"];
        linkHeader.target = "_blank";

        linkBlock.appendChild(linkHeader);

        let linkComment = document.createElement("p");
        linkComment.className = "linkComment";

        let linkCommentText = document.createTextNode(linksArray[i]["commentText"]);
        linkComment.appendChild(linkCommentText);
        linkComment.onclick = function() {
            document.getElementById(parentCommentID).scrollIntoView();
        };


        linkBlock.appendChild(linkComment);
        linksDiv.appendChild(linkBlock);
    }
    document.body.appendChild(linksDiv);
}


const linksDivCommentTexts = document.getElementsByClassName('linkComment');


Array.from(linksDivCommentTexts).forEach((el) => {
    shear(el, 3, '<span>  ... (more)</span>');
});
