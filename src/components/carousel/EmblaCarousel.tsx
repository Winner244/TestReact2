import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Thumb } from './EmblaCarouselThumbsButton'

import './emblaCarousel.less'

type EmblaCarouselProps = {
    slides: string[]
    options?: any
}

const EmblaCarousel: React.FC<EmblaCarouselProps> = ({ slides, options }) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options)
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: 'keepSnaps',
        dragFree: true
    })

    const onThumbClick = useCallback(
        (index: number) => {
            if (!emblaMainApi || !emblaThumbsApi) return

            emblaMainApi.scrollTo(index)
        },
        [emblaMainApi, emblaThumbsApi]
    )


    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return

        setSelectedIndex(emblaMainApi.selectedScrollSnap())
        emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
    }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])


    useEffect(() => {
        if (!emblaMainApi) return

        onSelect()

        emblaMainApi.on('select', onSelect).on('reInit', onSelect)
    }, [emblaMainApi, onSelect])

    
    return (
        <div className="embla-carousel">
            <div className="embla-carousel__viewport" ref={emblaMainRef}>
                <div className="embla-carousel__container">
                    {slides.map((slide, index) => (
                        <div className="embla-carousel__slide" key={index}>
                            <img src={slide} alt={`slide-${index}`} />
                        </div>
                    ))}
                </div>
            </div>

            {slides.length > 1 &&
                <div className="embla-carousel__thumbs">
                    <div className="embla-carousel__thumbs-viewport" ref={emblaThumbsRef}>
                        <div className="embla-carousel__thumbs-container">
                            {slides.map((slide, index) => (
                                <Thumb
                                    key={index}
                                    item={slide}
                                    onClick={() => onThumbClick(index)}
                                    selected={index === selectedIndex}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                </div>}
        </div>
    )
}

export default EmblaCarousel
