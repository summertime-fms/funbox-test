(() => {
    const cards = document.querySelectorAll('.good:not(.good--out-of-stock)');

    if (!cards.length) return;

    const cardClickHandler = (evt) => {
        const target = evt.target;

        if (!target.closest('.good__inner') && !target.classList.contains('good__button-buy')) return;

        target.closest('.good').classList.toggle('active');
    }

    const cardMouseleaveHandler = (evt) => {
      evt.target.classList.contains('active')
        ? evt.target.classList.add('selected')
        : evt.target.classList.remove('selected');
    }

    cards.forEach((card) => {
      card.addEventListener('click', cardClickHandler);
      card.addEventListener('mouseleave', cardMouseleaveHandler)
    })
})()
