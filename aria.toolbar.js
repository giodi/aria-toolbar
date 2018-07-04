(function() {
  'use strict';

  function ariaToolbar(options) {
    this.toolbar = options.toolbar;
    this.activeItem = options.activeItem;
  }
  ariaToolbar.prototype = {
    constructor: ariaToolbar,
    getToolbarItems: function() {
      return this.toolbar.querySelectorAll('button');
    },
    getToolbarSubmenus: function() {
      return this.toolbar.querySelectorAll('button+div');
    },
    getToolbarActiveItem: function() {
      return this.activeItem;
    },
    getNextElem: function() {
      return this.activeItem.parentNode.nextElementSibling.querySelector('button');
    },
    getPrevElem: function() {
      return this.activeItem.parentNode.previousElementSibling.querySelector('button');
    },
    setToolbarItems: function() {
      let tI = this.getToolbarItems();
      let i = tI.length;
      while (i--) {
        tI[i].setAttribute('tabindex', '-1');
        this.setClickAction(tI[i]);
      }
      let sI = this.getToolbarSubmenus();
      let j = sI.length;
      while (j--) {
        console.log();
        sI[j].setAttribute('id', 'menu' + j);
        sI[j].previousElementSibling.setAttribute('aria-haspopup', 'true');
        sI[j].previousElementSibling.setAttribute('aria-controls', 'menu' + j);
      }

      this.activeItem.setAttribute('tabindex', '0');
    },
    setActiveItem: function(elem) {
      if (elem !== this.activeItem) {
        elem.setAttribute('tabindex', '0');
        this.setFocusItem(elem);
        this.activeItem.setAttribute('tabindex', '-1');
        this.activeItem = elem;
      }
    },
    setActiveSubItem: function() {
      if (this.activeItem.hasAttribute('aria-controls')) {
        this.setActiveItem(this.activeItem.nextElementSibling.firstElementChild.firstElementChild);
      } else {
        console.log(this);
        this.setActiveItem(this.getNextElem());
      }
    },
    setFocusItem: function(elem) {
      elem.focus();
    },
    setClickAction: function(elem) {
      elem.addEventListener('click', this.setActiveItem.bind(this, elem));
    },
    setKeyboardNavi: function() {
      this.toolbar.addEventListener('keydown', (event) => {

        const keyName = event.key;

        switch (keyName) {
          case 'ArrowRight':
            this.setActiveItem(this.getNextElem());
            break;
          case 'ArrowLeft':
            this.setActiveItem(this.getPrevElem());
            break;
          case 'ArrowDown':
            this.setActiveSubItem();
            break;
          case 'ArrowUp':
            break;
          case 'Enter':
            break;
        }
      });
    },
    initToolbar: function() {
      this.setToolbarItems();
      this.setKeyboardNavi();
    },
  }

  let mainToolbar = new ariaToolbar({
    toolbar: document.querySelector('.aria-toolbar'),
    activeItem: document.querySelector('button')
  });
  mainToolbar.initToolbar();

})();
