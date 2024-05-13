document.addEventListener('DOMContentLoaded', () => {
  // Get the raised column element
  const raisedColumn = document.querySelector('.floating-div')

  // Function to handle scroll events
  function handleScroll() {
    // Get the scroll position
    const scrollPosition = window.scrollY

    // Determine the threshold to trigger the change
    const threshold = 500

    // If the user has scrolled past the threshold
    if (scrollPosition > threshold) {
      raisedColumn.style.top = '0' // Reset the position of the raised column
    } else {
      raisedColumn.style.top = '-70%' // Raise the column again
    }
  }

  // Add event listener for scroll events
  window.addEventListener('scroll', handleScroll)
})
