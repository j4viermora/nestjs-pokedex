import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios'
import { PokeResponse } from './interfaces/poke-response.interfaces';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios
  private readonly pokeUrl: string = 'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0'

  async executeSeed() {

    const { data } = await this.axios.get<PokeResponse>(this.pokeUrl)

    data.results.forEach(({ name, url }) => {

      const segments = url.split('/')
      const no: number = Number(segments[segments.length - 2])
      const pokemon = { name, no }



    })


    return data.results;
  }
}
