/**
 * @app ReadMoreJS
 * @desc Breaks the content of an element to the specified number of words
 * @version 1.1.0
 * @license The MIT License (MIT)
 * @author George Raptis | http://georap.gr
 */
(function (win, doc, undef) {
  'use strict';

  /**
   * @desc this object holds all functions
   */
  const RM = {};

  /* ============================== */
  /*             HELPERS            */
  /* ============================== */
  RM.helpers = {
    extendObj: function () {
      for (let i = 1, l = arguments.length; i < l; i++) {
        for (const key in arguments[i]) {
          if (arguments[i].hasOwnProperty(key)) {
            if (
              arguments[i][key] &&
              arguments[i][key].constructor &&
              arguments[i][key].constructor === Object
            ) {
              arguments[0][key] = arguments[0][key] || {};
              this.extendObj(arguments[0][key], arguments[i][key]);
            } else {
              arguments[0][key] = arguments[i][key];
            }
          }
        }
      }
      return arguments[0];
    }
  };

  /* ============================== */
  /*         MAIN FUNCTIONS         */
  /* ============================== */

  // Return the number of words of string.
  RM.countWords = function (str) {
    return str.split(/\s+/).length;
  };

  // Rturn string starting from first word untill number specified.
  RM.generateTrimmed = function (str, wordsNum) {
    return str.split(/\s+/).slice(0, wordsNum).join(' ') + '...';
  };

  // Plugin Initialization
  RM.init = function (options) {
    const defaults = {
      target: '',
      numOfWords: 50,
      toggle: true,
      moreLink: 'read more...',
      lessLink: 'read less',
      linkClass: 'rm-link',
      containerClass: false
    };
    options = RM.helpers.extendObj({}, defaults, options);

    const target = doc.querySelectorAll(options.target); // Get the node list of target elements specified by the user.
    const targetLen = target.length; // Length of the targets node list.
    let targetContent; // The initial text that is contained in the target element.
    let trimmedTargetContent; // The final (trimmed) text.
    let targetContentWords; // The number of words the initial text has.
    const initArr = []; // Array to hold the initial text of each target element.
    const trimmedArr = []; // Array to hold the final (trimmed) text of each target element.
    let i;
    let j;
    let l;
    let moreContainer;
    let rmLink;
    let moreLinkID;
    let index;

    // Loop through all target elements
    for (i = 0; i < targetLen; i++) {
      targetContent = target[i].innerHTML; // Get the initial text of each target element.
      trimmedTargetContent = RM.generateTrimmed(
        targetContent,
        options.numOfWords
      ); // Generate the trimmed version of the initial text.
      targetContentWords = RM.countWords(targetContent); // Count the number of words the initial text has.

      initArr.push(targetContent); // Push the initial text to initArr.
      trimmedArr.push(trimmedTargetContent); // Push the trimmed text to trimmedArr.

      // Procceed only if the number of words specified by the user
      // is smaller than the number of words the target element has.
      if (options.numOfWords < targetContentWords - 1) {
        target[i].innerHTML = trimmedArr[i]; // Populate the target element with the trimmed version of text.

        moreContainer = doc.createElement('div'); // Create a div element to hold the More/Less link.
        if (options.containerClass) {
          moreContainer.className = options.containerClass;
        }

        moreContainer.innerHTML =
          '<a id="rm-more_' +
          i +
          '"' + // Create the More/Less link.
          ' class="' +
          options.linkClass +
          '"' +
          ' style="cursor:pointer;" data-readmore="anchor">' +
          options.moreLink +
          '</a>';
        target[i].parentNode.insertBefore(moreContainer, target[i].nextSibling); // Insert the More/Less link after the target element.
      }
    }

    rmLink = doc.querySelectorAll('[data-readmore="anchor"]'); // Reference the More/Less link.
    // Loop through all links and attach event listeners.
    for (j = 0, l = rmLink.length; j < l; j++) {
      rmLink[j].onclick = function () {
        moreLinkID = this.getAttribute('id'); // Get each link's unique identifier.
        index = moreLinkID.split('_')[1]; // Extract index number from each link's 'id'.

        // if (!helpers.classList.contains(this, 'less')) {
        if (this.getAttribute('data-clicked') !== 'true') {
          target[index].innerHTML = initArr[index];
          if (options.toggle !== false) {
            this.innerHTML = options.lessLink;
            this.setAttribute('data-clicked', true);
          } else {
            this.innerHTML = '';
          }
        } else {
          target[index].innerHTML = trimmedArr[index];
          this.innerHTML = options.moreLink;
          this.setAttribute('data-clicked', false);
        }
      };
    }
  };

  // Return as global object
  window.$readMoreJS = RM;
})(this, this.document);
