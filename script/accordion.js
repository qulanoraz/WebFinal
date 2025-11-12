const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    
    header.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        accordionItems.forEach(otherItem => {
            otherItem.classList.remove('active');
        });
        
        if (!isOpen) {
            item.classList.add('active');
        }
    });
});