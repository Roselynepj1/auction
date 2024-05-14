import {
  createElement,
  formatDate,
  hideElement,
  calculateTimeRemaining,
} from '../js/utilities.mjs'
import { deleteListing } from '../js/api/listings/listings.mjs'

export const createListingTableRow = (listing) => {
  const { title, media, tags, endsAt, created, id, description } = listing
  // Create the <tr> element
  const tr = createElement('tr', ['row-class-name'])

  // Create the <td> elements with their respective content
  const td1 = createElement('td', ['text-center'])
  const img = createElement('img', ['rounded-circle'], {
    src: media[0] || '/src/assets/Image.svg',
    alt: title,
    width: '36',
    height: '36',
  })
  td1.appendChild(img)

  const td2 = createElement('td')
  td2.textContent = title

  const td3 = createElement('td')
  td3.textContent = description

  const td4 = createElement('td')
  td4.textContent = tags.join(', ')

  const td5 = createElement('td')
  td5.textContent = formatDate(endsAt)

  const td6 = createElement('td')
  td6.textContent = formatDate(created)

  const td7 = createElement('td')
  const div = createElement('div', [
    'hstack',
    'justify-content-center',
    'gap-2',
    'h-100',
  ])

  const img1 = createElement('img', [], {
    src: '/src/assets/Bars.svg',
    title: 'View Details',
    alt: 'View Listing Icon Details',
    width: '24',
    height: '24',
  })
  const a1 = createElement('a', [], {
    href: '/pages/single-product.html?id=' + id,
  })
  a1.appendChild(img1)

  const img2 = createElement('img', [], {
    src: '/src/assets/Edit.svg',
    title: 'Edit Details',
    alt: 'Edit Listing Icon Details',
    width: '24',
    height: '24',
  })
  const a2 = createElement('a', [], {
    href: '/pages/create-listing.html?id=' + id,
  })
  a2.appendChild(img2)

  const img3 = createElement('img', [], {
    src: '/src/assets/Trash.svg',
    title: 'Delete Details',
    alt: 'Delete Listing Icon Details',
    width: '24',
    height: '24',
  })
  const a3 = createElement('a', [], { href: 'javascript:void(0)' })
  a3.appendChild(img3)

  a3.addEventListener('click', () => {
    const confirmDelete = confirm(
      'Are you sure you want to remove this listing?',
    )

    if (!confirmDelete) return

    //Remove the listing
    deleteListing(id)
      .then((res) => {
        alert('Listing removed successfully')
        hideElement(tr)
      })
      .catch((error) => {
        console.log(error)
        alert('Could not delete listing. because something went wrong')
      })
  })

  div.appendChild(a1)
  div.appendChild(a2)
  div.appendChild(a3)

  td7.appendChild(div)

  // Append all <td> elements to the <tr> element
  tr.appendChild(td1)
  tr.appendChild(td2)
  tr.appendChild(td3)
  tr.appendChild(td4)
  tr.appendChild(td5)
  tr.appendChild(td6)
  tr.appendChild(td7)

  // Return the <tr> element
  return tr
}

/**
 * Creates a product element with specified details.
 * @param {string} listing - The object.
 * @returns {HTMLElement} The product element.
 */
export function createProductElement(listing,width='col-lg-4') {
  const { media, endsAt, title: productName, id: productId } = listing
  const imageUrl = media[0] || '/src/assets/Image.svg'
  const remainingTime = calculateTimeRemaining(endsAt)

  // Create the main container div
  const productContainer = createElement('div', [
    'col-sm-12',
    'col-md-6',
    width,
    'mb-5',
  ])

  // Create the product element
  const productElement = createElement('div', [
    'product',
    'rounded',
    'border',
    'border-1',
    'border-light',
    'p-3',
  ])

  // Create the product image container
  const productImageContainer = createElement('div', [
    'product-image-container',
  ])

  // Create the product image
  const productImage = createElement('img', ['product-image'], {
    src: imageUrl,
    alt: 'Product Image',
  })
  productImageContainer.appendChild(productImage)

  // Create the product date container
  const productDateContainer = createElement('div', ['product-date', 'hstack'])

  // Create the product date elements (days, hours, minutes, seconds)
  const dateElements = ['DAY', 'HRS', 'MIN', 'SEC']
  if (remainingTime) {
    const { days, hours, minutes, seconds } = remainingTime
    const timeValues = [days, hours, minutes, seconds]
    for (let i = 0; i < dateElements.length; i++) {
      // Create the date element container
      const dateElementContainer = createElement('div', [
        'vstack',
        'justify-content-center',
        'align-items-center',
      ])

      // Create the value element (e.g., 04)
      const valueElement = createElement('h6', ['value'])
      valueElement.textContent = timeValues[i]

      // Create the type element (e.g., DAY)
      const typeElement = createElement('h6', ['type'])
      typeElement.textContent = dateElements[i]

      // Append value and type elements to the container
      dateElementContainer.appendChild(valueElement)
      dateElementContainer.appendChild(typeElement)

      // Append the date element container to the product date container
      productDateContainer.appendChild(dateElementContainer)

      // Add a separator after each date element (except the last one)
      if (i < dateElements.length - 1) {
        const separatorElement = createElement('div', ['vstack', 'date-sep'])
        const separatorImage = createElement('img', [], {
          src: '/src/assets/More-Vert.svg',
          alt: 'More Verticle Icon',
        })
        separatorElement.appendChild(separatorImage)
        productDateContainer.appendChild(separatorElement)
      }
    }
  }

  // Append the product image container and product date container to the main product element
  productImageContainer.appendChild(productDateContainer)
  productElement.appendChild(productImageContainer)

  // Create the product details container
  const productDetailsContainer = createElement('div', [
    'product-details',
    'pt-4',
    'vstack',
    'gap-2',
  ])

  // Create the product name element
  const productNameElement = createElement('h4', [
    'fs-5',
    'd-inline',
    'text-truncate',
  ])
  productNameElement.textContent = productName

  // Create the "Bid now" button
  const bidButton = createElement(
    'a',
    ['btn', 'btn-dark', 'btn-outline-light', 'align-self-start'],
    {
      href: `/pages/single-product.html?id=${productId}`,
    },
  )
  bidButton.textContent = remainingTime ? 'Bid now' : 'Auction Ended'

  // Append product name element and "Bid now" button to the product details container
  remainingTime && productDetailsContainer.appendChild(productNameElement)
  productDetailsContainer.appendChild(bidButton)

  // Append the product details container to the main product element
  productElement.appendChild(productDetailsContainer)

  // Append the main product element to the product container
  productContainer.appendChild(productElement)

  // Return the product container
  return productContainer
}

/**
 * Creates a product card element with specified content.
 * @param {object} listing - The listing object.
 * @returns {HTMLDivElement} The created product card element.
 */
export function createProductCard(listing) {
  const { media, title, description, id } = listing
  // Create container div with specified classes
  const container = createElement('div', [
    'hstack',
    'gap-4',
    'p-2',
    'bg-primary',
    'rounded',
    'mb-3'
  ])

  // Create image element
  const img = createElement('img', [], {
    src: media[0] || '/src/assets/Image.svg',
    alt: title,
    width: '250',
    height: '180',
  })

  // Create inner container div with specified classes
  const innerContainer = createElement('div', ['vstack', 'gap-2'])

  // Create title element
  const titleElement = createElement('h4', [], {
    textContent: title,
  })

  // Create description paragraph element
  const descriptionElement = createElement('p', [], {
    textContent: description,
  })

  // Create link element
  const linkElement = createElement(
    'a',
    ['btn', 'btn-primary', 'btn-outline-light', 'align-self-start'],
    {
      href: `/pages/single-product.html?id=${id}`,
    },
  )
  const linkSpan = createElement('span', [], {
    textContent: 'View Listing',
  })

  // Append elements to inner container
  innerContainer.appendChild(titleElement)
  innerContainer.appendChild(descriptionElement)
  linkElement.appendChild(linkSpan)
  innerContainer.appendChild(linkElement)

  // Append image and inner container to container
  container.appendChild(img)
  container.appendChild(innerContainer)

  return container
}
