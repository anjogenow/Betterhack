use starknet::{ContractAddress, get_caller_address};
use core::array::ArrayTrait;
use core::traits::Into;
use starknet::storage_access::StorageAccess;
use starknet::Store;

#[derive(Copy, Drop, Serde, starknet::Store)]
struct GameEvent {
    id: u256,
    name: felt252,
    description: felt252,
    organizer: ContractAddress,
    max_participants: u64,
    max_team_size: u64,
    teams_lock_time: u64,
    end_time: u64,
    state: u8,
}

#[starknet::interface]
trait IEventManager<TContractState> {
    fn create_event(
        ref self: TContractState,
        name: felt252,
        description: felt252,
        max_participants: u64,
        max_team_size: u64,
        teams_lock_time: u64,
        end_time: u64,
    ) -> u256;
    
    fn get_event(self: @TContractState, id: u256) -> Option<GameEvent>;
    fn get_all_events(self: @TContractState) -> Array<GameEvent>;
    fn update_event_state(ref self: TContractState, id: u256, new_state: u8);
}

#[starknet::contract]
mod EventManager {
    use super::{ContractAddress, get_caller_address, ArrayTrait, Into, GameEvent};

    #[storage]
    struct Storage {
        events: LegacyMap::<u256, GameEvent>,
        event_count: u256,
        event_ids: LegacyMap::<u256, u256>, // index to id mapping for iteration
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        EventCreated: EventCreated,
        EventStateChanged: EventStateChanged,
    }

    #[derive(Drop, starknet::Event)]
    struct EventCreated {
        id: u256,
        organizer: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct EventStateChanged {
        id: u256,
        new_state: u8,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.event_count.write(0);
    }

    #[abi(embed_v0)]
    impl EventManagerImpl of super::IEventManager<ContractState> {
        fn create_event(
            ref self: ContractState,
            name: felt252,
            description: felt252,
            max_participants: u64,
            max_team_size: u64,
            teams_lock_time: u64,
            end_time: u64,
        ) -> u256 {
            let organizer = get_caller_address();
            assert(max_participants > 0, 'Invalid max participants');
            assert(max_team_size > 0, 'Invalid max team size');
            assert(teams_lock_time < end_time, 'Invalid lock time');

            let event_count = self.event_count.read();
            let new_id = event_count + 1;

            let event = GameEvent {
                id: new_id,
                name,
                description,
                organizer,
                max_participants,
                max_team_size,
                teams_lock_time,
                end_time,
                state: 0,
            };

            self.events.write(new_id, event);
            self.event_ids.write(event_count, new_id);
            self.event_count.write(new_id);

            self.emit(EventCreated { id: new_id, organizer });
            new_id
        }

        fn get_event(self: @ContractState, id: u256) -> Option<GameEvent> {
            if id > self.event_count.read() {
                return Option::None;
            }
            Option::Some(self.events.read(id))
        }

        fn get_all_events(self: @ContractState) -> Array<GameEvent> {
            let mut events = ArrayTrait::new();
            let count = self.event_count.read();
            let mut i: u256 = 1;
            
            loop {
                if i > count {
                    break;
                }
                events.append(self.events.read(i));
                i += 1;
            };
            
            events
        }

        fn update_event_state(ref self: ContractState, id: u256, new_state: u8) {
            let caller = get_caller_address();
            let event = self.events.read(id);
            assert(event.organizer == caller, 'Not event organizer');
            assert(new_state <= 2, 'Invalid state');

            let updated_event = GameEvent {
                state: new_state,
                ..event
            };
            self.events.write(id, updated_event);

            self.emit(EventStateChanged { id, new_state });
        }
    }
}
