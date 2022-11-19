import Image from 'next/image'
import React from 'react'

// Utils
import { envConfig } from '../../utils/envConfig'

const Badge = ({ points = 0, classlist = "" }) => {

    // Vars
    points = parseInt(points)

    // Functions

    // Returns badge image
    const getBadge = () => {

        const getBadgeImage = () => {
            if (envConfig?.isProdMode) {
                if (points >= 100 && points < 1000) return "/images/bronzeBadge.svg"
                if (points >= 1000 && points < 10_000) return "/images/silverBadge.svg"
                if (points >= 10_000 && points < 1_00_000) return "/images/goldBadge.svg"
                if (points >= 1_00_000) return "/images/platinumBadge.svg"
            } else {
                if (points >= 5 && points < 10) return "/images/bronzeBadge.svg"
                if (points >= 10 && points < 15) return "/images/silverBadge.svg"
                if (points >= 15 && points < 20) return "/images/goldBadge.svg"
                if (points >= 20) return "/images/platinumBadge.svg"
            }
            return false
        }

        const badgeResult = getBadgeImage()

        return (
            badgeResult !== false
                ?
                <Image
                    src={badgeResult}
                    width={20}
                    height={20}
                    className={`badge_for_points${classlist !== "" ? ` ${classlist}` : ''}`}
                    alt='badge' />
                :
                null)
    }

    return (
        <>{getBadge()}</>
    )
}

export default Badge