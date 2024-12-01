use starknet::ContractAddress;

#[starknet::interface]
trait IHackathonEvents<TContractState> {
    fn create_event(ref self: TContractState, event_id: felt252);
    fn get_event_organizer(self: @TContractState, event_id: felt252) -> ContractAddress;
    fn create_team(ref self: TContractState, event_id: felt252, team_id: felt252, participants: Array<ContractAddress>);
}

#[starknet::contract]
mod HackathonEvents {
    use core::array::ArrayTrait;
    use starknet::{ContractAddress, get_caller_address};
    use openzeppelin_access::ownable::OwnableComponent;
    use starknet::storage::Map;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        EventCreated: EventCreated,
        TeamCreated: TeamCreated,
    }

    #[derive(Drop, starknet::Event)]
    struct EventCreated {
        event_id: felt252,
        organizer: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct TeamCreated {
        event_id: felt252,
        team_id: felt252,
        participant_count: u32
    }

    #[storage]
    struct Storage {
        event_organizers: Map::<felt252, ContractAddress>,
        event_exists: Map::<felt252, bool>,
        team_participants: Map::<(felt252, felt252, u32), ContractAddress>,
        team_participant_count: Map::<(felt252, felt252), u32>,
        team_exists: Map::<(felt252, felt252), bool>,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
    }

    #[abi(embed_v0)]
    impl HackathonEventsImpl of super::IHackathonEvents<ContractState> {
        fn create_event(ref self: ContractState, event_id: felt252) {
            let caller = get_caller_address();
            assert!(!self.event_exists.read(event_id), "Event already exists");
            self.event_organizers.write(event_id, caller);
            self.event_exists.write(event_id, true);
            
            self.emit(Event::EventCreated(EventCreated { event_id, organizer: caller }));
        }

        fn get_event_organizer(self: @ContractState, event_id: felt252) -> ContractAddress {
            assert!(self.event_exists.read(event_id), "Event does not exist");
            self.event_organizers.read(event_id)
        }

        fn create_team(
            ref self: ContractState,
            event_id: felt252,
            team_id: felt252,
            participants: Array<ContractAddress>
        ) {
            assert!(self.event_exists.read(event_id), "Event does not exist");
            
            let team_key = (event_id, team_id);
            assert!(!self.team_exists.read(team_key), "Team already exists");
            
            let participant_count: u32 = participants.len().into();
            assert!(participant_count > 0, "Team must have at least one participant");
            
            let mut index: u32 = 0;
            loop {
                if index >= participant_count {
                    break;
                }
                let participant = *participants.at(index.into());
                self.team_participants.write((event_id, team_id, index), participant);
                index += 1;
            };
            
            self.team_exists.write(team_key, true);
            self.team_participant_count.write(team_key, participant_count);
            
            self.emit(Event::TeamCreated(TeamCreated { 
                event_id, 
                team_id, 
                participant_count
            }));
        }
    }
}