import { createElement, formatDate, hideElement } from '../js/utilities.mjs'
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
