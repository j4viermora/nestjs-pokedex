import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
// import axios, { AxiosInstance } from 'axios'
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
// import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokeResponse } from './interfaces/poke-response.interfaces';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {

  // private readonly axios: AxiosInstance = axios
  private readonly pokeUrl: string = 'https://pokeapi.co/api/v2/pokemon?limit=1000&offset=1'

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    // private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapter,
  ) { }

  async executeSeed() {
    await this.pokemonModel.deleteMany({})

    const data = await this.http.get<PokeResponse>(this.pokeUrl)
    // // This code can be map function
    // let insertPromiseArray = [];
    // data.results.forEach(({ name, url }) => {
    //   const segments = url.split('/')
    //   const no: number = Number(segments[segments.length - 2])
    //   const pokemon = { name, no }
    //   insertPromiseArray.push(this.pokemonService.create(pokemon))
    // })
    // await Promise.all(insertPromiseArray)


    let pokemonToInsert: { name: string, no: number }[] = []

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/')
      const no: number = Number(segments[segments.length - 2])
      const pokemon = { name, no }
      pokemonToInsert.push(pokemon)
    })

    await this.pokemonModel.insertMany(pokemonToInsert)


    return { message: 'Seed executed' };
  }
}
