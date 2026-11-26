import type { Photo } from "../lib/portfolio";
import heroImage from "../assets/images/illustrations/reception-hero.webp";
import image0 from "../assets/images/illustrations/reception-tables.webp";
import image1 from "../assets/images/illustrations/buffet-meals.webp";
import image2 from "../assets/images/illustrations/indoor-backdrop.webp";
import image3 from "../assets/images/illustrations/floral-cake.webp";
import image4 from "../assets/images/illustrations/small-chops-platter.webp";
import image5 from "../assets/images/illustrations/plated-meal.webp";
import image6 from "../assets/images/illustrations/reception-hall.webp";
import image7 from "../assets/images/illustrations/cake-and-cupcakes.webp";
import image8 from "../assets/images/illustrations/buffet-service.webp";
import image9 from "../assets/images/illustrations/floral-centrepiece.webp";
import image10 from "../assets/images/illustrations/buffet-selection.webp";
import image11 from "../assets/images/illustrations/pastry-and-dessert-table.webp";
export const illustrations: { photo: Photo; categories: string[] }[] = [
  { photo: { src: image0, alt: "Reception tables with lavender and white floral arrangements" }, categories: ["decoration"] },
  { photo: { src: image1, alt: "Buffet trays with rice and roasted chicken" }, categories: ["catering"] },
  { photo: { src: image2, alt: "Indoor floral backdrop with cream seating" }, categories: ["decoration"] },
  { photo: { src: image3, alt: "Two-tier cake with lavender and cream flowers" }, categories: ["baking"] },
  { photo: { src: image4, alt: "Assorted savoury snacks on a platter" }, categories: ["confectionery"] },
  { photo: { src: image5, alt: "Plated jollof rice, chicken and vegetables" }, categories: ["catering"] },
  { photo: { src: image6, alt: "Reception hall with floral stage and table settings" }, categories: ["decoration"] },
  { photo: { src: image7, alt: "Decorated cake and coordinated cupcakes" }, categories: ["baking"] },
  { photo: { src: image8, alt: "Catering buffet with guests in the background" }, categories: ["catering"] },
  { photo: { src: image9, alt: "Lavender and white floral centrepiece beside place settings" }, categories: ["decoration"] },
  { photo: { src: image10, alt: "Buffet with a selection of rice, meats and salads" }, categories: ["catering"] },
  { photo: { src: image11, alt: "Sweet and savoury pastries and dessert cups" }, categories: ["confectionery"] },
];
export const serviceIllustrations = (slug: string) => illustrations.filter(item => item.categories.includes(slug));
export const heroIllustration: Photo = { src: heroImage, alt: "Lavender and white reception tables beside a buffet" };
