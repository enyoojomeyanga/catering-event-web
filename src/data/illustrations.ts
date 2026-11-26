import type { Photo } from "../lib/portfolio";
import heroImage from "../assets/images/illustrations/reception-hero.webp";
import image0 from "../assets/images/illustrations/reception-tables.webp";
import image1 from "../assets/images/illustrations/buffet-meals.webp";
import image2 from "../assets/images/illustrations/indoor-backdrop.webp";
import image3 from "../assets/images/illustrations/floral-cake.webp";
import image4 from "../assets/images/illustrations/small-chops-platter.webp";
import image5 from "../assets/images/illustrations/plated-meal.webp";
import image6 from "../assets/images/illustrations/outdoor-ceremony.webp";
import image7 from "../assets/images/illustrations/pink-cake.webp";
import image8 from "../assets/images/illustrations/buffet-service.webp";
import image9 from "../assets/images/illustrations/floral-centrepiece.webp";
import image10 from "../assets/images/illustrations/chocolate-cake.webp";
import image11 from "../assets/images/illustrations/boxed-small-chops.webp";
export const illustrations: { photo: Photo; categories: string[] }[] = [
  { photo: { src: image0, alt: "Reception tables with floral arrangements" }, categories: ["decoration"] },
  { photo: { src: image1, alt: "Buffet trays with rice and chicken" }, categories: ["catering"] },
  { photo: { src: image2, alt: "Indoor floral backdrop and seating" }, categories: ["decoration"] },
  { photo: { src: image3, alt: "Two-tier floral cake" }, categories: ["baking"] },
  { photo: { src: image4, alt: "Assorted savoury snacks on a platter" }, categories: ["confectionery"] },
  { photo: { src: image5, alt: "Plated rice, chicken and vegetables" }, categories: ["catering"] },
  { photo: { src: image6, alt: "Outdoor ceremony seating and floral arch" }, categories: ["decoration"] },
  { photo: { src: image7, alt: "Pink cake with floral details" }, categories: ["baking"] },
  { photo: { src: image8, alt: "Covered buffet dishes arranged on a table" }, categories: ["catering"] },
  { photo: { src: image9, alt: "Pink and cream floral centrepiece" }, categories: ["decoration"] },
  { photo: { src: image10, alt: "Chocolate cake with decorative toppings" }, categories: ["baking"] },
  { photo: { src: image11, alt: "Assorted snacks in takeaway boxes" }, categories: ["confectionery"] },
];
export const serviceIllustrations = (slug: string) => illustrations.filter(item => item.categories.includes(slug));


export const heroIllustration: Photo = { src: heroImage, alt: "Lavender and white reception tables beside a buffet" };
