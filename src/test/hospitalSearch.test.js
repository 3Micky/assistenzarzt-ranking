import { describe, expect, it } from 'vitest'
import { findHospitalByExactName } from '../utils/hospitalSearch.js'

describe('hospital search helpers', () => {
  it('resolves an exactly typed hospital name to location metadata', () => {
    const hospital = findHospitalByExactName('Klinik Nauen')

    expect(hospital).toMatchObject({
      name: 'Klinik Nauen',
      city: 'Nauen',
      country: 'DE',
      region: 'Brandenburg',
    })
  })

  it('normalizes common clinic naming variants before matching', () => {
    const hospital = findHospitalByExactName('Klinikum Nauen')

    expect(hospital?.name).toBe('Klinik Nauen')
  })
})
